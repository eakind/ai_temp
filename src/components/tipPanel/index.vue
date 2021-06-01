<template>
  <div class="tip-panel">
    <slot></slot>
    <div class="left-icon"></div>
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
.tip-panel {
  min-width: 200px;
  min-height: 32px;
  line-height: 32px;
  padding: 0px 8px;
  border-radius: 4px;
  border: 1px solid #444444;
  color: #fff;
  font-size: 14px;
  background: #2B2B2B;
  position: relative;
  .left-icon {
    position: absolute;
    left: -6px;
    top: 14px;
    width: 8px;
    height: 8px;
    background: #2B2B2B;
    border-top: 1px solid #444444;
    border-left: 1px solid #444444;
    transform: rotate(-45deg);
  }
}
</style>
