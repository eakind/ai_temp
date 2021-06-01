<template>
  <Dialog title="特征交互" :isShow='interactionFlag' :hasPadding="false" :showBtn="true" @cancel='cancelHandler' @confirm="confirmHandler">
    <div class="tips">使用已有特征构建新特征。</div>
    <div class="panel-box">
      <div class="item">
        <div class="name bottom-line rename-box">命名新特征</div>
        <input type="text" v-model="newFeaName" placeholder="请输入新特征名称">
      </div>
      <div class="bottom-line">1.选择特征构成<span>最多可选3个特征组合</span></div>
      <div class="select-box">
        <div class="select-list">
          <span>A</span>
          <span class="default-span" v-if="selectedFeature">{{ selectedFeature.feature_name}}</span>
          <span @click="infoClick(selectInfoList[0], 'infoAFlag')" v-click-out="hideAHandler">特征信息</span>
          <feature-info v-if="infoAFlag" :featureDetail="featureDetail"></feature-info>
        </div>
        <div class="select-list">
          <span>B</span>
          <select-input select="请选择" :list="list" @on-change="selectB"></select-input>
          <span v-if="selectedB" @click="infoClick(selectInfoList[1], 'infoBFlag')" v-click-out="hideBHandler">特征信息</span>
          <feature-info v-if="infoBFlag" :featureDetail="featureDetail"></feature-info>
        </div>
        <div class="select-list">
          <span>C</span>
          <select-input select="请选择" :list="list" @on-change="selectC"></select-input>
          <span v-if="selectedC" @click="infoClick(selectInfoList[2], 'infoCFlag')" v-click-out="hideCHandler">特征信息</span>
          <feature-info v-if="infoCFlag" :featureDetail="featureDetail"></feature-info>
        </div>
      </div>
      <div class="bottom-line">2.创建特征关系<span>支持任意组合步骤1中选择的特征。</span></div>
      <div class="operate-box">
        <div class="feature-box margin-right">
          <span>特征</span>
          <drop-list :list="feaList" select="请选择" type="methods" class="drop-list" @on-change="changeFeaOne"></drop-list>
        </div>
        <div class="cal-box margin-right">
          <span>运算</span>
          <drop-list :list="operateList" select="请选择" class="drop-list" @on-change="changeOperateOne"></drop-list>
        </div>
        <div class="feature-box margin-right">
          <span>特征</span>
          <drop-list :list="feaList" select="请选择" type="methods" class="drop-list" @on-change="changeFeaTwo"></drop-list>
        </div>
        <div class="cal-box margin-right">
          <span>运算</span>
          <drop-list :list="operateList" select="请选择" class="drop-list" @on-change="changeOperateTwo"></drop-list>
        </div>
        <div class="feature-box">
          <span>特征</span>
          <drop-list :list="feaList" select="请选择" type="methods" class="drop-list" @on-change="changeFeaThr"></drop-list>
        </div>
      </div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/dialog/index.vue';
import SelectInput from './selectInput.vue';
import DropList from '@/components/dropList/index.vue';
import featureInfo from './featureInfo.vue';
import { getFeatureList } from '../../mixins/getFeatureList.js';
import { mapState } from 'vuex';
import { post } from '@/api/server';
export default {
  data () {
    return {
      newFeaName: '',
      selectList: [],
      feaList: [],
      operateList: [],
      targetFlag: false,
      list: [],
      selectedB: false,
      selectedC: false,
      feaOne: '',
      feaTwo: '',
      feaThr: '',
      operateOne: '',
      operateTwo: '',
      transform: '',
      featureDetail: null,
      selectInfoList: [],
      infoAFlag: false,
      infoBFlag: false,
      infoCFlag: false
    };
  },
  components: {
    Dialog,
    SelectInput,
    DropList,
    featureInfo
  },
  props: {
    interactionFlag: {
      type: Boolean,
      default: false
    }
  },
  mixins: [getFeatureList],
  computed: {
    ...mapState(['projectId']),
    ...mapState('content', ['selectedFeature'])
  },
  watch: {
    selectList: {
      handler (list) {
        this.operateList = [];
        this.feaList = [];
        let result = list.some((item) => {
          return item.data_type === 'STRING';
        });
        if (result) {
          this.operateList = [{
            name: '*',
            value: '*'
          }];
        } else {
          let tempArr = ['(空)', '+', '-', '*', '/'];
          for (let i in tempArr) {
            this.operateList.push({
              name: tempArr[i],
              value: tempArr[i]
            });
          }
        }
        let tempObj = {
          0: 'A',
          1: 'B',
          2: 'C'
        };
        for (let i = 0; i < list.length; i++) {
          if (!list[i]) continue;
          let obj = JSON.parse(JSON.stringify(list[i]));
          obj.funArr = [];
          obj.selectName = {
            name: tempObj[i],
            value: tempObj[i]
          };
          if (obj.data_type !== 'STRING') {
            if (Number(obj.min_value) > 0) {
              obj.funArr.push({
                name: `log${tempObj[i]}`,
                value: `log${tempObj[i]}`
              });
              obj.funArr.push({
                name: `${tempObj[i]}^2`,
                value: `${tempObj[i]}^2`
              });
              obj.funArr.push({
                name: `√${tempObj[i]}`,
                value: `√${tempObj[i]}`
              });
            } else {
              obj.funArr.push({
                name: `${tempObj[i]}^2`,
                value: `${tempObj[i]}^2`
              });
            }
          }
          this.feaList.push(obj);
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    this.getFeatureList();
    this.init();
  },
  methods: {
    init () {
      this.selectList.splice(0, 1, this.selectedFeature);
      this.selectInfoList.splice(0, 1, this.selectedFeature);
    },
    cancelHandler () {
      this.$emit('on-cancel');
    },
    infoClick (item, val) {
      this.featureDetail = item;
      switch (val) {
        case 'infoAFlag':
          this.infoAFlag = true;
          break;
        case 'infoBFlag':
          this.infoBFlag = true;
          break;
        case 'infoCFlag':
          this.infoCFlag = true;
          break;
      }
    },
    hideAHandler () {
      this.infoAFlag = false;
    },
    hideBHandler () {
      this.infoBFlag = false;
    },
    hideCHandler () {
      this.infoCFlag = false;
    },
    async confirmHandler () {
      if (!this.newFeaName) {
        this.$message({
          message: '请输入新特征名称',
          type: 'warning'
        });
        return;
      }
      let params = {
        project_id: this.projectId,
        feature_name: this.newFeaName,
        // feature_idx: this.selectedFeature.feature_idx,
        converted_type: 'FORMULA',
        converted_param: this.transform
      };
      let res = await post('featureCreate', params);
      if (res.code === 0) {
        this.cancelHandler();
        this.bus.$emit('refreshFeatureList');
      }
      // this.$emit('on-confirm');
    },
    selectB (item, index) {
      this.featureDetail = item;
      if (index === 0) {
        this.selectedB = false;
        this.selectList.splice(1, 1);
        this.$set(this.selectInfoList, 1, {});
      } else {
        this.$set(this.selectList, 1, item);
        this.$set(this.selectInfoList, 1, item);
        this.selectedB = true;
      }
    },
    selectC (item, index) {
      if (index === 0) {
        this.selectedC = false;
        this.selectList.splice(2, 1);
        this.$set(this.selectInfoList, 2, {});
      } else {
        this.selectedC = true;
        this.$set(this.selectList, 2, item);
        this.$set(this.selectInfoList, 2, item);
      }
    },
    changeFeaOne (item, list) {
      this.feaOne = JSON.stringify(item) === '{}' ? '' : this.selectHandler(item, list);
      this.change();
    },
    changeOperateOne (item, list) {
      this.operateOne = item.name === '(空)' ? '' : item.name;
      this.change();
    },
    changeFeaTwo (item, list) {
      this.feaTwo = JSON.stringify(item) === '{}' ? '' : this.selectHandler(item, list);
      this.change();
    },
    changeOperateTwo (item, list) {
      this.operateTwo = item.name === '(空)' ? '' : item.name;
      this.change();
    },
    changeFeaThr (item, list) {
      this.feaThr = JSON.stringify(item) === '{}' ? '' : this.selectHandler(item, list);
      this.change();
    },
    selectTitle (list) {
      if (list.data_type === 'STRING') {
        return `dummy[${list.feature_idx}]`;
      } else {
        return `column[${list.feature_idx}]`;
      }
    },
    selectHandler (item, list) {
      if (item.name.includes('log')) return `log[${list.feature_idx}]`;
      if (item.name.includes('^2')) return `square[${list.feature_idx}]`;
      if (item.name.includes('√')) return `sqrt[${list.feature_idx}]`;
      if (['A', 'B', 'C'].includes(item.name)) {
        if (list.data_type === 'STRING') {
          return `dummy[${list.feature_idx}]`;
        } else {
          return `column[${list.feature_idx}]`;
        }
      }
    },
    change () {
      let str = `${this.feaOne}${this.operateOne}${this.feaTwo}${this.operateTwo}${this.feaThr}`;
      this.transform = str;
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../style/featureOperate.scss';
</style>
