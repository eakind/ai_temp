<template>
  <div class="loading-wrap">
    <div class="loading-box">
      <div class="content">
        <img src="@/assets/loading.gif" width="80">
        <span class="loading-tip">加载中，请稍等</span>
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
  }
}
</style>
