<template>
  <div class="select-data-source" v-if="datasourceFlag">
    <span class="icon"></span>
    <div class="select-panel">
      <span class="title">选择数据源</span>
      <div class="item" @click="selectHanlder(0)">使用原数据</div>
      <div class="item" @click="selectHanlder(1)">使用新数据（本地上传）</div>
      <div class="item last-item" v-if="modelType === 'SCORECARD'" @click="selectHanlder(2)">生成评分卡（原数据）</div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
    };
  },
  props: {
    datasourceFlag: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['modelType'])
  },
  methods: {
    selectHanlder (index) {
      this.$emit('select', index);
    }
  }
};
</script>
<style lang='scss' scoped>
.select-data-source {
  position: absolute;
  right: 0px;
  top: 45px;
  z-index: 1;
  .icon {
    display: inline-block;
    position: absolute;
    z-index: 1;
    right: 22px;
    top: -8px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 8px solid #333;
  }
  .select-panel {
    width: 190px;
    padding: 8px;
    border-radius: 4px;
    background: #333;
    position: relative;
    .title {
      line-height: 24px;
      font-size: 12px;
    }
    .item {
      height: 36px;
      line-height: 36px;
      border-radius: 4px;
      background: #444444;
      text-align: center;
      margin-bottom: 16px;
      cursor: pointer;
    }
    .last-item {
      margin-top: 32px;
      position: relative;
      &::before {
        content: '';
        height: 1px;
        width: 100%;
        background: #F6B421;
        position: absolute;
        left: 0px;
        top: -16px;
      }
    }
  }
}
</style>
