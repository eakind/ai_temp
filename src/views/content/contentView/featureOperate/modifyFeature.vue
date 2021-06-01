<template>
  <Dialog title="特征修改" :isShow='modifyFlag' :hasPadding="false" :showBtn="true" @cancel='cancelHandler' @confirm="confirmHandler">
    <div class="tips">修改特征类型或进行缺失填充。</div>
    <div class="panel-box">
      <div class="select-operate">
        <div class="item">
          <div class="name bottom-line rename-box">命名新特征</div>
          <input type="text" v-model="newFeatureName" placeholder="请输入新特征名称">
        </div>
        <div class="bottom-line">选择操作</div>
        <div class="item">
          <div class="name">1.缺失填充</div>
          <el-checkbox v-model="fillingChecked">不对此修改</el-checkbox>
        </div>
        <div class="item" :class="fillingChecked ? 'no-pointer' : ''">
          <div class="name">自定义缺失值</div>
          <input type="text" v-model="missing" placeholder="不填写则由系统自动识别">
        </div>
        <div class="item" :class="fillingChecked ? 'no-pointer' : ''">
          <div class="name">选择填充值</div>
          <drop-list :list="fillingList" :select="selectedFeature.data_type === 'STRING' ? '自动' : '自动'" class="drop-list" @on-change="changeFilling"></drop-list>
          <input type="text" v-model="fillValue" placeholder="请输入" class="customize-input" v-if="inputFlag">
        </div>
        <div class="no-modify-mask" v-if="fillingChecked"></div>
      </div>
      <div class="modify-methods">
        <div class="item">
          <div class="name">2.修改方式</div>
          <el-checkbox v-model="typeChecked">不对此修改</el-checkbox>
        </div>
        <div class="item"  :class="typeChecked ? 'no-pointer' : ''">
          <drop-list :list="typeList" :select="type === 'STRING' ? '转换为数值' : (this.type === 'INT' || this.type === 'FLOAT' && this.selectedFeature.unique_num === 1 ? '函数变换' : '离散化')" class="drop-list" @on-change="changeType"></drop-list>
          <div class="item-panel" v-if="selectName === '离散化'">
            划分{{selectName}} <input v-model="sectionNum" onkeyup ="value=value.replace(/[^\d]/g,'')" >份
          </div>
          <div class="item-panel" v-if="selectName === '函数变换'">
            <el-radio v-model="transform" label="LOG" v-if="Number(selectedFeature.min_value) > 0">Log</el-radio>
            <el-radio v-model="transform" label="SQUARE">Square</el-radio>
            <el-radio v-model="transform" label="EXP">Exp</el-radio>
          </div>
          <div class="item-panel format-panel" v-if="selectName === '转换为时间'">
            <drop-list :list="formatList" select="AUTO" class="format-list" @on-change="changeFormat"></drop-list>
          </div>
        </div>
        <div class="no-modify-mask" v-if="typeChecked"></div>
      </div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/dialog/index.vue';
import DropList from '@/components/dropList/index.vue';
import { mapState } from 'vuex';
import { post } from '@/api/server';
export default {
  data () {
    return {
      newFeatureName: '',
      missing: '',
      fillValue: '',
      sectionNum: '2',
      fillingChecked: false,
      typeChecked: true,
      fillingList: [{
        name: '自动',
        value: 'NONE'
      }, {
        name: '平均值',
        value: 'MEAN'
      }, {
        name: '中位数',
        value: 'MEDIAN'
      }, {
        name: '众数',
        value: 'MODE'
      }, {
        name: '自定义特殊值',
        value: 'CUSTOM'
      }],
      typeList: [{
        name: '离散化',
        value: 'BINNING'
      }, {
        name: '函数变换',
        value: 'FUNC'
      }, {
        name: '转换为字符串',
        value: 'STRING'
      }],
      fillMethod: 'NONE',
      inputFlag: false,
      type: 'FLOAT',
      convertedType: '',
      convertedParam: '',
      selectName: '离散化',
      transform: '',
      hasConvertedType: false,
      formatList: [{
        name: 'AUTO',
        value: 'AUTO'
      }, {
        name: 'YYYY-MM-DD HH:MI:SS',
        value: 'YYYY-MM-DD HH:MI:SS'
      }, {
        name: 'YYYY-MM-DD HH:MI:SS.FFFFFF',
        value: 'YYYY-MM-DD HH:MI:SS.FFFFFF'
      }, {
        name: 'MM/DD/YYYY HH:MI:SS',
        value: 'MM/DD/YYYY HH:MI:SS'
      }, {
        name: 'MM/DD/YY HH:MI:SS',
        value: 'MM/DD/YY HH:MI:SS'
      }, {
        name: 'YYYY-MM-DD',
        value: 'YYYY-MM-DD'
      }, {
        name: 'MM/DD/YYYY',
        value: 'MM/DD/YYYY'
      }, {
        name: 'MM/DD/YY',
        value: 'MM/DD/YY'
      }, {
        name: 'YYYYMMDD',
        value: 'YYYYMMDD'
      }, {
        name: 'HH:MI',
        value: 'HH:MI'
      }, {
        name: 'HH:MI:SS',
        value: 'HH:MI:SS'
      }, {
        name: 'HH:MI:SS PM',
        value: 'HH:MI:SS PM'
      }, {
        name: '下午 HH:MI:SS',
        value: '下午 HH:MI:SS'
      }]
    };
  },
  components: {
    Dialog,
    DropList
  },
  props: {
    modifyFlag: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    convertedType (val) {
      console.log(val);
      if (val === 'BINNING') {
        this.convertedParam = this.sectionNum ? Number(this.sectionNum) : '';
      } else if (val === 'FUNC') {
        if (Number(this.selectedFeature.min_value) > 0) {
          this.convertedParam = 'LOG';
          this.transform = 'LOG';
        } else {
          this.convertedParam = 'SQUARE';
          this.transform = 'SQUARE';
        }
      } else if (val === 'DATETIME') {
        this.convertedParam = 'AUTO';
      } else {
        this.convertedParam = '';
      }
    },
    sectionNum (val) {
      if (this.selectName === '离散化') {
        this.convertedParam = val ? Number(val) : '';
      }
    },
    transform (val) {
      if (this.selectName === '函数变换') {
        this.convertedParam = val;
      }
    }
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('content', ['selectedFeature', 'targetFeature'])
  },
  mounted () {
    console.log(this.selectedFeature);
    this.init();
    this.newFeatureName = this.selectedFeature.feature_name;
  },
  methods: {
    init () {
      let list = JSON.parse(JSON.stringify(this.typeList));
      this.typeList = [];
      this.type = this.selectedFeature.data_type;
      if (this.type === 'FLOAT') {
        let obj = {
          name: '浮点数转换为整数',
          value: 'INT'
        };
        this.typeList = list;
        this.typeList.splice(2, 0, obj);
        if (this.selectedFeature.unique_num === 1) {
          this.typeList.splice(0, 1);
          this.selectName = '函数变换';
        } else {
          this.selectName = '离散化';
        }
        // this.selectName = '离散化';
      } else if (this.type === 'INT') {
        this.typeList = list;
        if (this.selectedFeature.unique_num === 1) {
          this.typeList.splice(0, 1);
          this.selectName = '函数变换';
        } else {
          this.selectName = '离散化';
        }
      } else if (this.type === 'TIME') {
        this.typeList = [{
          name: '转换为时间戳',
          value: 'DATETIME'
        }, {
          name: '转换为字符',
          value: 'STRING'
        }];
        this.selectName = '转换为时间戳';
      } else if (this.type === 'STRING') {
        this.selectName = '转换为数值';
        this.typeList = [{
          name: '转换为数值',
          value: 'FLOAT'
        }, {
          name: '转换为时间',
          value: 'DATETIME'
        }];
      }
      if (this.selectName === '离散化') {
        this.convertedType = 'BINNING';
        this.convertedParam = this.sectionNum ? Number(this.sectionNum) : '';
      } else if (this.selectName === '转换为数值') {
        this.convertedType = 'FLOAT';
        this.convertedParam = '';
      } else if (this.selectName === '转换为时间戳') {
        this.convertedType = 'DATETIME';
        this.convertedParam = 'DATE';
      } else if (this.selectName === '转换为时间') {
        this.convertedType = 'DATETIME';
        this.convertedParam = 'AUTO';
      } else if (this.selectName === '函数变换') {
        this.convertedType = 'FUNC';
      }
      let filList = JSON.parse(JSON.stringify(this.fillingList));
      if (this.selectedFeature.data_type === 'STRING') {
        this.fillingList = filList.splice(-2, 3);
        this.fillingList.unshift({
          name: '自动',
          value: ''
        });
      } else {
        this.fillingList = filList;
      }
    },
    cancelHandler () {
      this.$emit('on-cancel');
    },
    async confirmHandler () {
      if (this.fillingChecked && this.typeChecked) {
        this.$message({
          message: '请选择操作',
          type: 'warning'
        });
        return;
      }
      if (this.selectName === '离散化' && Number(this.sectionNum) === 0) {
        this.$message({
          message: '离散化维度不能为0',
          type: 'warning'
        });
        return;
      }
      console.log(this.sectionNum);
      let params = {
        project_id: this.projectId,
        missing: this.missing,
        fill_value: this.fillValue,
        fill_method: this.fillMethod,
        feature_name: this.newFeatureName,
        feature_idx: this.selectedFeature.feature_idx,
        converted_param: this.convertedParam,
        converted_type: this.convertedType
      };
      if (this.typeChecked) {
        delete params.converted_param;
        delete params.converted_type;
      }
      if (this.fillingChecked) {
        delete params.fill_value;
        delete params.missing;
        delete params.fill_method;
      }
      for (let key in params) {
        if (params[key] === '') {
          delete params[key];
        }
      }
      if (params.fill_method && params.fill_method === 'CUSTOM' && !this.fillValue) {
        this.$message({
          message: '请输入自定义填充值',
          type: 'warning'
        });
        return;
      }
      let res = await post('featureCreate', params);
      if (res.code === 0) {
        this.$message({
          message: '操作成功。',
          type: 'success'
        });
        this.cancelHandler();
        this.bus.$emit('refreshFeatureList');
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        });
      }
    },
    changeFilling (item) {
      this.fillMethod = item.value;
      if (item.name === '自定义特殊值') {
        this.inputFlag = true;
      } else {
        this.inputFlag = false;
        this.fillValue = '';
      }
    },
    changeType (item) {
      this.selectName = item.name;
      this.convertedType = item.value;
    },
    changeFormat (item) {
      this.convertedParam = item.value;
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../style/featureOperate.scss';
</style>
