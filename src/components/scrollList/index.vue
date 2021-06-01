<template>
  <div class="scroll-list" @scroll="scrollHandler">
    <slot></slot>
  </div>
</template>
<script>
export default {
  data () {
    return {
      timer: null
    };
  },
  methods: {
    scrollHandler (event) {
      this.$nextTick(() => {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          let top = event.target.scrollTop;
          let bTop = this.$el.firstChild.clientHeight;
          let height = this.$el.clientHeight;
          if (bTop - top < height) {
            this.$emit('loadMore');
            clearTimeout(this.timer);
            this.timer = null;
          }
        }, 100);
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.scroll-list {
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
}
</style>
