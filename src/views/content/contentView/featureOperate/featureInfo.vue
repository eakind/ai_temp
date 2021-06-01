<template>
  <div class="content">
    <div class="tip-panel">
      <div class="feature_name">{{featureDetail.feature_name}}</div>
      <div>数值类型： {{featureDetail.data_type}}</div>
      <div>维数： {{featureDetail.unique_num}}</div>
      <div>缺失: {{featureDetail.missing_num}}</div>
      <div>平均值： {{featureDetail.mean_value}}</div>
      <div>中位数： {{featureDetail.median_value}}</div>
      <div>众数： {{featureDetail.mode_value}}</div>
      <div>最小值： {{featureDetail.min_value}}</div>
      <div>最大值： {{featureDetail.max_value}}</div>
      <div class="left-icon"></div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {};
  },
  props: {
    info: {
      type: Object
    },
    featureDetail: {
      type: Object
    }
  }
};
</script>
<style lang='scss' scoped>
.content {
  position: absolute;
  top: 40px;
  left: 24px;
}
.tip-panel {
  height: 166px;
  width: 240px;
  padding: 8px 8px;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  background: #333;
  position: relative;
  z-index: 1;
  .left-icon {
    position: absolute;
    right: 28px;
    top: -4px;
    width: 8px;
    height: 8px;
    background: #333;
    border-right: 1px solid #333;
    border-left: 1px solid #333;
    transform: rotate(-45deg);
  }
  .feature_name {
    color: #FCF8DF;
  }
}
</style>
