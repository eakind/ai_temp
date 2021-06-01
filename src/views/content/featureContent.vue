<template>
  <div class="feature-content">
    <div class="top-content">
      <div class="tips">支持对特征进行修改、缺失填充、转换和特征交互的操作。请选择需要处理的特征和对应特征工程方式。每种特征工程将生成一个任务，请等待前一特征工程任务完成后再进行新的特征工程操作。</div>
      <div class="content-box">
        <target-feature class="target-feature" v-if="modelType !== 'CLUSTERING'"></target-feature>
        <processing-feature class="processing-feature"></processing-feature>
        <feature-operate class="feature-operate" @on-operate="modifyHandler"></feature-operate>
      </div>
    </div>
    <div class="bottom-content">
      <div class="title">现有数据信息</div>
      <div class="tips">特征工程生成的新特征也会在此显示。可点击下方数据，切换为当前处理特征。</div>
      <div class="select-box">
        <div class="left">
          <drop-list :list="featureList" select="全部特征" class="drop-list" @on-change="changeHandler"></drop-list>
          <search-input class="search-input" @change="changekeyWord" :inputValue='keyWord'></search-input>
        </div>
        <div class="right">
          排序
          <drop-list :list="sortNameList" select="默认" class="sort-list" @on-change="orderChangeHandler"></drop-list>
          <drop-list :list="sortList" select="顺序" class="sort-list" @on-change="sortChangeHandler"></drop-list>
        </div>
      </div>
      <feature-table class="feature-table" :tableType="tableType" :headerTitle="headerTitle" :tableData="list" :headerArr="headerArr" @on-more="loadMore" @select-data="selectData"></feature-table>
    </div>
    <modify-feature v-if="modifyFlag" :modifyFlag="modifyFlag"
     @on-cancel="modifyCancel" @on-confirm="modifyConfirm">
    </modify-feature>
    <transform-feature v-if="transformFlag" :transformFlag="transformFlag"
     @on-cancel="transformCancel" @on-confirm="transformConfirm">
    </transform-feature>
    <feature-interaction v-if="interactionFlag" :interactionFlag="interactionFlag"
     @on-cancel="interactionCancel" @on-confirm="interactionConfirm">
    </feature-interaction>
    <binning-adjustment v-if="adjustmentFlag" :adjustmentFlag="adjustmentFlag"
     @on-cancel="adjustmentCancel" @on-confirm="adjustmentConfirm">
    </binning-adjustment>
    <binning-operate v-if="binningFlag" :binningFlag="binningFlag"
     @on-cancel="binningCancel" @on-confirm="binningConfirm" @binning-confirm="confirm">
    </binning-operate>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import TargetFeature from './contentView/targetFeature.vue';
import ProcessingFeature from './contentView/processingFeature.vue';
import FeatureOperate from './contentView/featureOperate.vue';
import DropList from '@/components/dropList/index.vue';
import SearchInput from '@/components/searchInput/index.vue';
import FeatureTable from './contentView/featureTable.vue';
import ModifyFeature from './contentView/featureOperate/modifyFeature.vue';
import TransformFeature from './contentView/featureOperate/TransformFeature.vue';
import FeatureInteraction from './contentView/featureOperate/featureInteraction.vue';
import BinningAdjustment from './contentView/binningAdjustment/binningAdjustment.vue';
import BinningOperate from './contentView/binningOperate/binningOperate.vue';
import { featurization } from '../content/mixins/featurization.js';
export default {
  data () {
    return {
      keyWord: '',
      featureList: [{
        name: '全部特征',
        value: 'ALL'
      }, {
        name: '正常特征',
        value: 'NORMAL'
      }, {
        name: '隐藏特征(特征工程产生)',
        value: 'HIDDEN'
      }],
      featureListType: 'ALL',
      sortList: [{
        name: '顺序',
        value: 'asc'
      }, {
        name: '逆序',
        value: 'desc'
      }],
      sortNameList: [{
        name: '默认',
        value: ''
      }, {
        name: '名称',
        value: 'feature_name'
      }, {
        name: '平均值',
        value: 'mean_value'
      }, {
        name: '众数',
        value: 'mode_value'
      }, {
        name: '最小值',
        value: 'min_value'
      }, {
        name: '最大值',
        value: 'max_value'
      }],
      modifyFlag: false,
      transformFlag: false,
      interactionFlag: false,
      binningFlag: false,
      adjustmentFlag: false,
      headerTitle: ['来源', '特征名称', '类别', '维数', '缺失', '平均值', '众数', '最小值', '最大值'],
      headerArr: ['status', 'feature_name', 'data_type', 'unique_num', 'missing_num', 'mean_value',
        'mode_value', 'min_value', 'max_value', 'hidden'],
      list: [],
      tableType: 'special'
    };
  },
  mixins: [featurization],
  computed: {
    ...mapState(['modelType'])
  },
  components: {
    TargetFeature,
    ProcessingFeature,
    FeatureOperate,
    DropList,
    SearchInput,
    FeatureTable,
    ModifyFeature,
    TransformFeature,
    FeatureInteraction,
    BinningAdjustment,
    BinningOperate
  },
  methods: {
    modifyHandler (index) {
      if (index === 0) {
        this.modifyFlag = true;
      } else if (index === 1) {
        this.transformFlag = true;
      } else if (index === 2) {
        this.interactionFlag = true;
      } else if (index === 3) {
        this.adjustmentFlag = true;
      } else if (index === 4) {
        this.binningFlag = true;
      }
    },
    confirm () {
      this.list = [];
      this.offset = 0;
      this.getFeatureList();
      this.binningFlag = false;
    },
    modifyCancel () {
      this.modifyFlag = false;
    },
    modifyConfirm () {
      this.modifyFlag = false;
    },
    transformCancel () {
      this.transformFlag = false;
    },
    transformConfirm () {
      this.transformFlag = false;
    },
    interactionCancel () {
      this.interactionFlag = false;
    },
    interactionConfirm () {
      this.interactionFlag = false;
    },
    binningCancel () {
      this.binningFlag = false;
    },
    binningConfirm () {
      this.binningFlag = false;
    },
    adjustmentCancel () {
      this.adjustmentFlag = false;
    },
    adjustmentConfirm () {
      this.adjustmentFlag = false;
    },
    changeHandler (item) {
      this.featureListType = item.value;
      this.offset = 0;
      this.list = [];
      this.type = item.value;
      this.direction = 'asc';
      this.setSelectedBinning(null);
      this.getFeatureList();
    }
  }
};
</script>
<style lang='scss' scoped>
@import './style/featureContent.scss';
</style>
