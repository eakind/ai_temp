<template>
  <div class="legend-box">
    <div class="list"><span>数据类型</span><span v-if="featureValueObj">{{ featureValueObj.data_type }}</span></div>
    <div class="list" style="visibility:hidden"></div>
    <div class="list"><span>维数</span><span v-if="featureValueObj">{{ featureValueObj.unique_num }}</span></div>
    <div class="list"><span>缺失率</span><span></span></div>
    <div class="list"><span>缺失</span><span v-if="featureValueObj">{{ featureValueObj.missing_num }}</span></div>
    <div class="list"><span>标准差</span><span></span></div>
    <div class="list"><span>平均值</span><span v-if="featureValueObj">{{ featureValueObj.mean_value }}</span></div>
    <div class="list"><span>25%分位</span><span></span></div>
    <div class="list"><span>众数</span><span v-if="featureValueObj">{{ featureValueObj.mode_value }}</span></div>
    <div class="list"><span>50%分位</span><span v-if="featureValueObj">{{ featureValueObj.median_value }}</span></div>
    <div class="list"><span>最大值</span><span v-if="featureValueObj">{{ featureValueObj.max_value }}</span></div>
    <div class="list"><span>75%分位</span><span></span></div>
    <div class="list"><span>最小值</span><span v-if="featureValueObj">{{ featureValueObj.min_value }}</span></div>
    <div class="list"><span>相关系数</span><span v-if="featureValueObj">{{ featureValueObj.data_type }}</span></div>
    <div class="list"><span>丢失</span><span v-if="featureValueObj">{{ featureValueObj.lost_num }}</span></div>
    <div class="list"><span>卡方值(P)</span><span></span></div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {};
  },
  props: {
    featureValueObj: {
      type: Object
    }
  },
  computed: {
    ...mapState('content', ['targetFeature'])
  }
};
</script>
<style lang='scss' scoped>
.legend-box {
  height: 100%;
  width: 100%;
  padding: 16px;
  border-radius: 4px;
  background: #222222;
  font-size: 14px;
  color: #fff;
  box-shadow: inset -4px -4px 4px 0px rgba($color: #646464, $alpha: 0.4),inset 4px 4px 8px 0px rgba($color: #646464, $alpha: 0.4);
  .list {
    width: calc(50% - 34px);
    float: left;
    position: relative;
    height: 32px;
    line-height: 32px;
    border-right: 1px solid #424242;
    margin: 0px 16px;
    &:nth-child(even) {
      border: none;
    }
    >span:nth-child(1) {
      display: inline-block;
      width: 84px;
      &::before {
        content: '';
        height: 4px;
        width: 4px;
        border-radius: 50%;
        position: absolute;
        background: #F6B421;
        left: -16px;
        top: 14px;
      }
    }
    >span:nth-child(2){
      color: #FCF8DF;
    }
  }
}
</style>
