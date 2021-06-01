<template>
  <div class="clustering-chart" id="cluster-chart">
    <feature-list></feature-list>
    <chart-info :group="group" :isDownload="isDownload"></chart-info>
  </div>
</template>
<script>
import FeatureList from './clusteringChart/featureList';
import ChartInfo from './clusteringChart/chartInfo.vue';
export default {
  data () {
    return {};
  },
  props: {
    group: {
      type: [Number, String]
    },
    isDownload: {
      type: String
    }
  },
  components: {
    FeatureList,
    ChartInfo
  }
};
</script>
<style lang='scss' scoped>
.clustering-chart {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
