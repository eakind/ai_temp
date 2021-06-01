<template>
  <div class="select-feature">
    <div class="title">选择参与建模的特征</div>
    <div class="tips">默认使用全部项目数据进行建模。特征工程内新增的特征自动参与建模。请确认并选择参与建模的特征。（***p&lt;0.01, **p&lt;0.05, *p&lt;0.1）</div>
    <div class="select-box">
      <div class="left">
        <search-input class="search-input" @change="changekeyWord" :inputValue='keyWord' inputTip="特征名称"></search-input>
      </div>
      <div class="right">
        排序
        <drop-list :list="sortNameList" select="默认" class="sort-list" @on-change="orderChangeHandler"></drop-list>
        <drop-list :list="sortList" select="顺序" class="sort-list" @on-change="sortChangeHandler"></drop-list>
      </div>
    </div>
    <div class="table-box">
      <div class="list-box">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" class="check-box">全选</el-checkbox>
        <div class="header-title table-list">
          <span v-for="(item, index) in headerTitle" :key="index">
            {{ item }}
          </span>
        </div>
      </div>
      <scroll-list class="table-body" @loadMore="loadMore">
        <div class="list-box" v-for="(item, tIdx) in list" :key="tIdx">
          <el-checkbox v-model="item.selected" class="check-box" @change="selectHandler(item, tIdx)"></el-checkbox>
          <div class="body-list table-list" :class="firstList && firstList.feature_idx === item.feature_idx ? 'active' : ''" @click="selectList(item)">
            <span v-for="(childItem, cIdx) in headerArr" :key="cIdx">
              {{ childItem === 'status' ? setStatusName(item[childItem]) : item[childItem] }}
            </span>
          </div>
        </div>
      </scroll-list>
    </div>
    <info-panel class="info-panel" @on-more="moreHandler" :listInfor="firstList" v-if="firstList"></info-panel>
    <data-infor :dialogFag="dialogFag" @cancel="cancelHandler" :listInfor="firstList" v-if="firstList"></data-infor>
  </div>
</template>
<script>
import DropList from '@/components/dropList/index.vue';
import SearchInput from '@/components/searchInput/index.vue';
import ScrollList from '@/components/scrollList/index.vue';
import InfoPanel from './selectFeature/infoPanel.vue';
import DataInfor from './selectFeature/dataInfor.vue';
import { getFeatureList } from '../content/mixins/getFeatureList.js';
import { mapState, mapMutations } from 'vuex';
import { get, post } from '@/api/server';
export default {
  data () {
    return {
      keyWord: '',
      sortNameList: [{
        name: '默认',
        value: ''
      }, {
        name: '来源',
        value: 'status'
      }, {
        name: '特征名称',
        value: 'feature_name'
      }, {
        name: '数据类型',
        value: 'data_type'
      }, {
        name: '平均值',
        value: 'mean_value'
      }],
      sortList: [{
        name: '顺序',
        value: 'asc'
      }, {
        name: '逆序',
        value: 'desc'
      }],
      checkAll: true,
      isIndeterminate: false,
      headerTitle: ['来源', '特征名称', '类型', '缺失', '平均值'],
      headerArr: ['status', 'feature_name', 'data_type', 'missing_num', 'mean_value'],
      headerList: [{
        name: '来源',
        value: 'status'
      }, {
        name: '特征名称',
        value: 'feature_name'
      }, {
        name: '类型',
        value: 'data_type'
      }, {
        name: '缺失率',
        value: 'missing_num'
      }, {
        name: '平均值',
        value: 'mean_value'
      }, {
        name: '标准差',
        value: ''
      }, {
        name: '皮尔逊相关系数',
        value: ''
      }, {
        name: '卡方值(P)',
        value: ''
      }],
      orderBy: '',
      list: [],
      dialogFag: false,
      listInfor: null
    };
  },
  mixins: [getFeatureList],
  components: {
    DropList,
    SearchInput,
    ScrollList,
    InfoPanel,
    DataInfor
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('content', ['selectedFeature'])
  },
  mounted () {
    this.offset = 0;
    this.type = 'ALL';
    this.direction = 'asc';
    this.getFeatureList();
    this.getIsAll();
    this.listInfor = this.list.length ? this.list[0] : null;
  },
  methods: {
    ...mapMutations('content', ['setSelectedFeature']),
    setStatusName (val) {
      let str = '';
      switch (val) {
        case 'BINNING':
          str = '分箱';
          break;
        case 'RAW':
          str = '原数据';
          break;
        case 'FORMULA':
          str = '特征交互';
          break;
        case 'NONE':
          str = '特征修改';
          break;
        case 'CONVERT':
          str = '特征修改';
          break;
        case 'DUMMY':
          str = '特征转换';
          break;
      }
      return str;
    },
    async getIsAll () {
      let params = {
        project_id: this.projectId
      };
      let res = await get('selectedAll', params);
      if (res.code === 0) {
        this.checkAll = res.selected_all;
        this.isIndeterminate = this.checkAll ? !this.checkAll : this.checkAll;
      }
    },
    selectList (item) {
      this.firstList = item;
    },
    changekeyWord (val) {
      this.keyWord = val;
      this.offset = 0;
      this.list = [];
      this.getFeatureList();
    },
    orderChangeHandler (item) {
      this.orderBy = item.value;
      this.offset = 0;
      this.list = [];
      this.getFeatureList();
    },
    sortChangeHandler (item) {
      this.direction = item.value;
      this.offset = 0;
      this.list = [];
      this.getFeatureList();
    },
    loadMore () {},
    handleCheckAllChange () {
      for (let i in this.list) {
        this.$set(this.list[i], 'selected', this.checkAll);
      }
      this.selectAllList();
    },
    async selectAllList () {
      let params = {
        project_id: this.projectId,
        selected: this.checkAll,
        feature_list: []
      };
      this.$set(this.selectedFeature, 'selected', this.checkAll);
      this.setSelectedFeature(this.selectedFeature);
      await post('selectFeaList', params);
      // let res = await post('selectFeaList', params);
      // if (res.code === 0) {
      //   this.offset = 0;
      //   this.list = [];
      //   this.getFeatureList('', true);
      // }
    },
    selectHandler (item, index) {
      this.list.splice(index, 1, item);
      this.selectFea(item);
    },
    async selectFea (item) {
      let param = {
        project_id: this.projectId,
        selected: item.selected,
        feature_name: item.feature_name,
        feature_idx: item.feature_idx
      };
      if (item.feature_idx === this.selectedFeature.feature_idx) {
        this.$set(this.selectedFeature, 'selected', item.selected);
        this.setSelectedFeature(this.selectedFeature);
      }
      let res = await post('selectFea', param);
      this.getIsAll();
      if (res.code === 0) {
      }
    },
    moreHandler () {
      this.dialogFag = true;
    },
    cancelHandler () {
      this.dialogFag = false;
    }
  }
};
</script>
<style lang='scss' scoped>
@import './style/selectFeature.scss';
</style>
