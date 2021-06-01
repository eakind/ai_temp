<template>
  <div class="target-chart">
    <div class="title">选择目标变量</div>
    <div class="tips">选择目标变量后，即可开始建模。如需筛选参与建模的特征或对特征进行处理，请先选择“特征工程”。</div>
    <div class="feature-box">
      <span v-if="targetFeature">当前特征：{{ targetFeature.feature_name }}</span>
      <div class="select-box" :class="targetFlag? 'active' : ''" v-click-out="hide" @click="targetFlag=true">
        选择
        <span class="iconfont icon-db_arrow"></span>
        <select-panel class="select-panel" panelType="target" :list="list" v-if="targetFlag" @change-keyWord="changeTargetKeyWord" @load-more="targetLoadMore" @select-target="selectTargetFea"></select-panel>
      </div>
    </div>
    <div class="chart-box">
      <div class="chart" ref="tChart"></div>
      <chart-legend class="chart-legend" :featureValueObj="targetFeature"></chart-legend>
    </div>
    <drop-list :list="metricsList" :select="setMetricsName" class="drop-list" @on-change="changeMetrics" v-if="metricsList.length!==0"></drop-list>
  </div>
</template>
<script>
import DropList from '@/components/dropList/index.vue';
import ChartLegend from '@/components/chartLegend/index.vue';
import SelectPanel from '../selectPanel.vue';
import { getFeatureList } from '../mixins/getFeatureList.js';
import { setTarget } from '../mixins/setTarget.js';
import { mapState, mapMutations } from 'vuex';
import { post } from '@/api/server';
import { createWs } from '@/mixins/createWs.js';
export default {
  data () {
    return {
      targetFlag: false,
      list: []
    };
  },
  mixins: [getFeatureList, setTarget, createWs],
  computed: {
    ...mapState(['projectId']),
    ...mapState('content', ['metricsList', 'metricsSelect', 'targetFeature']),
    setMetricsName () {
      let str = '';
      if (this.metricsList.length > 0) {
        if (this.metricsSelect) {
          str = this.metricsSelect;
        } else {
          str = this.metricsList[0].name;
        }
      } else {
        str = '';
      }
      return str;
    }
  },
  components: {
    DropList,
    ChartLegend,
    SelectPanel
  },
  mounted () {
    // this.initWs();
    // this.getFeatureList();
    this.legalTargetList();
  },
  methods: {
    ...mapMutations('content', ['setTargetFeature', 'setMetricsList', 'setMetricsSelect', 'setSelectedFeature']),
    selectTargetFea (item) {
      this.targetFlag = false;
      if (this.targetFeature) {
        this.tempTarget = JSON.parse(JSON.stringify(this.targetFeature));
      }
      this.setTargetFeature(item);
      this.createWs();
      this.postTargetModel(item);
    },
    createWs () {
      this.initWs();
      window.ws.onmessage = (event) => {
        if (!event.data) return;
        let data = JSON.parse(event.data);
        if (data.error_code === 0) {
          this.getTargetChartData();
        } else {
          this.$message({
            message: this.$t(data.error_code),
            type: 'warning'
          });
          this.setTargetFeature(this.tempTarget);
        }
        if (this.targetFeature.feature_idx === this.selectedFeature.feature_idx) {
          if (this.list.length) {
            if (this.targetFeature.feature_idx === this.list[0].feature_idx) {
              this.setSelectedFeature(this.list[1]);
            } else {
              this.setSelectedFeature(this.list[0]);
            }
          }
          this.bus.$emit('refreshSelected');
        }
      };
    },
    async postTargetModel (item) {
      let params = {
        project_id: this.projectId,
        target_feature_idx: item.feature_idx
      };
      let res = await post('postTargetModel', params);
      if (res.code === 0) {
        // this.getTargetChartData();
      } else {
        // this.setTargetFeature(this.tempTarget);
      }
    },
    hide () {
      this.targetFlag = false;
    }
  }
};
</script>
<style lang='scss' scoped>
@import './style/setTarget.scss';
</style>
