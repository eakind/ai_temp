<template>
  <div class="target-feature">
    <div class="choose-box">
      <div class="title">目标特征</div>
      <div class="select-box" :class="targetFlag? 'active' : ''" v-click-out="hide" @click="targetFlag=true">
        选择
        <span class="iconfont icon-db_arrow"></span>
        <select-panel class="select-panel" panelType="target" :list="list" v-if="targetFlag"
          @change-keyWord="changeTargetKeyWord" @load-more="targetLoadMore" @select-target="selectTargetFea"></select-panel>
      </div>
    </div>
    <div class="choose-box margin-style">
      <div class="feature-name" v-if="targetFeature">{{ targetFeature.feature_name }}</div>
      <drop-list :list="metricsList" :select="setMetricsName" class="drop-list" v-if="metricsList.length !== 0" @on-change="changeMetrics"></drop-list>
    </div>
    <div class="chart" ref="tChart"></div>
  </div>
</template>
<script>
import SelectPanel from '../selectPanel.vue';
import DropList from '@/components/dropList/index.vue';
import { mapState, mapMutations } from 'vuex';
import { post } from '@/api/server';
import { setTarget } from '../mixins/setTarget.js';
import { getFeatureList } from '../mixins/getFeatureList.js';
export default {
  data () {
    return {
      targetFlag: false,
      list: [],
      tempTarget: []
    };
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('content', ['targetFeature', 'metricsList']),
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
  mixins: [setTarget, getFeatureList],
  components: {
    SelectPanel,
    DropList
  },
  mounted () {
    // this.getFeatureList();
    this.legalTargetList();
  },
  methods: {
    ...mapMutations('content', ['setMetricsSelect', 'setTargetFeature']),
    selectTargetFea (item) {
      this.targetFlag = false;
      if (this.targetFeature) {
        this.tempTarget = JSON.parse(JSON.stringify(this.targetFeature));
      }
      this.setTargetFeature(item);
      this.postTargetModel(item);
      this.bus.$emit('refreshFeatureList');
    },
    async postTargetModel (item) {
      let params = {
        project_id: this.projectId,
        target_feature_idx: item.feature_idx
      };
      let res = await post('postTargetModel', params);
      if (res.code === 0) {
        this.getTargetChartData();
        // let list = res.metrics_list;
        // let arr = [];
        // for (let i = 0; i < list.length; i++) {
        //   arr.push({
        //     name: list[i].metric_name,
        //     value: list[i].metric_code
        //   });
        //   if (list[i].metric_code === res.optimize_metric) {
        //     this.setMetricsSelect(list[i].metric_name);
        //   }
        // }
        // this.setMetricsList(arr);
      } else {
        this.setTargetFeature(this.tempTarget);
      }
    },
    hide () {
      this.targetFlag = false;
    },
    async changeMetrics (item) {
      let param = {
        project_id: this.projectId,
        optimize_metric: item.value
      };
      let res = await post('postMetricModel', param);
      if (res.code === 0) {
        this.setMetricsSelect(item.name);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.target-feature {
  height: 100%;
  width: 100%;
  padding-right: 24px;
  border-right: 1px solid #424242;
  .choose-box {
    display: flex;
    align-items: center;
    .title {
      margin-right: 8px;
      line-height: 32px;
      width: 160px;
      padding-left: 24px;
      border-radius: 4px;
      background: #333333;
      position: relative;
      &::before {
        content: '';
        border-radius: 4px;
        height: 4px;
        width: 16px;
        top: 14px;
        left: 0px;
        position: absolute;
        background: linear-gradient(90deg, #89F7FE 0%, #66A6FF 100%);
      }
    }
    .drop-list {
      width: 120px;
      height: 32px;
    }
    .feature-name {
      flex: 1;
      color: white;
      background: linear-gradient(90deg, #89F7FE 0%, #66A6FF 100%);
      background-clip: text;
      color: transparent;
      font-weight: bold;
    }
  }
  .margin-style {
    margin: 18px 0px;
  }
  .select-box {
    height: 32px;
    line-height: 32px;
    width: 80px;
    text-align: center;
    border-radius: 4px;
    background: #2B2B2B;
    border: 1px solid #444444;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    >span {
      color: #F6B421;
      padding-left: 8px;
    }
    .select-panel {
      position: absolute;
      left: 85px;
      top: 0px;
    }
  }
  .chart {
    width: 100%;
    height: 200px;
  }
}
</style>
