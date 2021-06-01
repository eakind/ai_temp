<template>
  <div class="normal-info">
    <div class="title">特征名称</div>
    <div class="infor">featurename</div>
    <div class="title">来源</div>
    <div class="infor">特征交互</div>
    <div class="title">计算方式</div>
    <div class="infor">featurename + featurename</div>
  </div>
</template>
<script>
export default {
  data () {
    return {};
  }
};
</script>
<style lang='scss' scoped>
.normal-info {
  background: #2B2B2B;
  padding: 16px;
  color: #fff;
  font-size: 14px;
  margin-top: 10px;
  .title {
    position: relative;
    line-height: 30px;
    &::after {
      content: '';
      height: 1px;
      width: 22px;
      background: #F6B421;
      position: absolute;
      left: 0px;
      bottom: 0px;
    }
  }
  .infor {
    line-height: 30px;
    margin-bottom: 20px;
  }
}
</style>
