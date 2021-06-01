<template>
  <div class="selected-chart">
    <div class="title">建模特征数据对比</div>
    <div class="tips">可选择其他特征，与已选目标变量进行比对。</div>
    <div class="feature-box">
      <span v-if="selectedFeature">当前特征：{{ selectedFeature.feature_name }}</span>
      <div class="select-box" :class="featureFlag? 'active' : ''" v-click-out="hideFlag" @click="featureFlag=true">
        选择
        <span class="iconfont icon-db_arrow"></span>
        <select-panel class="select-panel" panelType="select" :list="list"  @load-more="loadMore" v-if="featureFlag" @select-selected="featureFlag=false"></select-panel>
      </div>
    </div>
    <div class="legend">
      <span class="bar-legend" v-if="selectedFeature">{{ selectedFeature.feature_name }}</span>
      <span class="line-legend" v-if="targetFeature"></span>
      <span class="target-txt" v-if="targetFeature">{{ targetFeature.feature_name }}</span>
    </div>
    <div class="selected-chart-box">
      <div class="chart" ref="sChart" id="selectedChart">
      </div>
      <chart-legend class="chart-legend" :featureValueObj="selectedFeature"></chart-legend>
    </div>
    <div class="operate-box">
      <drop-list :list="numList" select="20" class="drop-list" @on-change="changeNum"></drop-list>
      <div class="download" @click="downloadImg">
        <span class="iconfont icon-db_download"></span>
        下载图表
      </div>
    </div>
  </div>
</template>
<script>
import DropList from '@/components/dropList/index.vue';
import ChartLegend from '@/components/chartLegend/index.vue';
import SelectPanel from '../selectPanel.vue';
import { getFeatureList } from '../mixins/getFeatureList.js';
import { selectedData } from '../mixins/selectedData.js';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      featureFlag: false,
      list: [],
      numList: [],
      tempTarget: null
    };
  },
  watch: {
    list: {
      handler (arr) {
        if (!this.selectedFeature && arr.length) {
          this.setSelectedFeature(arr[0]);
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('content', ['selectedFeature', 'targetFeature'])
  },
  mixins: [getFeatureList, selectedData],
  components: {
    DropList,
    SelectPanel,
    ChartLegend
  },
  mounted () {
    this.getFeatureList();
  },
  methods: {
    hideFlag () {
      this.featureFlag = false;
    }
  }
};
</script>
<style lang='scss' scoped>
@import './style/setTarget.scss';
</style>
