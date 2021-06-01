<template>
  <div class="loading-wrap">
    <div class="loading-box">
      <div class="content">
        <img src="@/assets/loading.gif" width="80">
        <span class="loading-tip">数据处理中，请稍后</span>
        <span class="return-tip">数据处理时间可能较长，可先返回项目列表。</span>
        <span class="bottom-tip">处理完成后，可在列表中查看</span>
        <span class="btn" @click="returnClick">项目列表</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {};
  },
  methods: {
    returnClick () {
      this.$emit('on-return');
    }
  }
};
</script>
<style lang='scss' scoped>
.loading-wrap {
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 1000px;
  font-family: "siyuanheiti";
  background: rgba($color: #000000, $alpha: 0.4);
  font-size: 14px;
  color: #fff;
  .loading-box {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content {
    width: 500px;
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .loading-tip {
      margin-top: 10px;
    }
    .return-tip {
      margin-top: 20px;
    }
    .btn {
      margin-top: 16px;
      width: 120px;
      height: 32;
      line-height: 32px;
      text-align: center;
      border-radius: 4px;
      background: linear-gradient(0deg, #EDDE5D 0%, #F09819 100%);
      cursor: pointer;
    }
  }
}
</style>
