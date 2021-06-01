<template>
  <div class="info-panel">
    <div class="title">其他数据信息</div>
    <div class="tips">当前特征</div>
    <div class="name">{{listInfor.feature_name}}</div>
    <div class="list"><span>维数</span><span>{{listInfor.unique_num}}</span></div>
    <div class="list"><span>缺失</span><span>{{listInfor.missing_num}}</span></div>
    <div class="list"><span>众数</span><span>{{listInfor.mean_value}}</span></div>
    <div class="list"><span>25%分位</span><span></span></div>
    <div class="list"><span>50%分位</span><span></span></div>
    <div class="list"><span>75%分位</span><span></span></div>
    <div class="btn" @click="moreClick">查看更多</div>
  </div>
</template>
<script>
export default {
  data () {
    return {};
  },
  props: {
    listInfor: {
      type: Object
    }
  },
  methods: {
    moreClick () {
      this.$emit('on-more');
    }
  }
};
</script>
<style lang='scss' scoped>
.info-panel{
  height: 342px;
  width: 240px;
  border-radius: 4px;
  background: #444444;
  border: 1px solid #F6B421;
  padding: 0px 24px 18px 24px;
  font-size: 14px;
  .title {
    position: relative;
    line-height: 40px;
    &::before {
      content: '';
      height: 1px;
      width: 52px;
      background: #F6B421;
      position: absolute;
      bottom: 0px;
      left: 0px;
    }
  }
  .tips {
    font-size: 12px;
    color: #A4A4A4;
    line-height: 24px;
    margin: 8px 0px;
  }
  .name {
    width: 100%;
    line-height: 32px;
    border-bottom: 1px solid #666666;
  }
  .list {
    line-height: 32px;
    width: 100%;
    >span {
      display: inline-block;
      &:nth-child(1) {
        margin-left: 18px;
        width: 100px;
        position: relative;
        &::before {
          content: '';
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #F6B421;
          position: absolute;
          top: 14px;
          left: -16px;
        }
      }
      &:nth-child(2) {
        width: calc(10% - 100px);
        color: #FCF8DF;
      }
    }
  }
  .btn {
    color: #F6B421;
    margin-top: 12px;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
