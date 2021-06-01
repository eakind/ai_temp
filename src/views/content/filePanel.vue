<template>
  <div class="panel-box">
    <span class="icon"></span>
    <div class="panel">
      <div class="list" v-for="(item, index) in hasFileList" :key="index">
        <span>{{ index + 1 }}. {{ item.file_name }}</span>
        <span>{{ switchSize(item.file_size) }}, {{ item.file_columns ? item.file_columns : 0 }}个特征, {{ item.file_rows }}行 </span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      list: [{}, {}, {}, {}, {}, {}]
    };
  },
  computed: {
    ...mapState(['hasFileList'])
  },
  methods: {
    switchSize (size) {
      let max = 1024 * 1024;
      if (size > max) {
        return Math.floor(size / max) + ' MB';
      } else {
        return Math.floor(size / 1024) + ' KB';
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.panel {
  width: 192px;
  padding: 8px 16px;
  border-radius: 4px;
  background: linear-gradient(90deg, #5FA981, #4876B3);
  position: relative;
  .list {
    >span {
      display: block;
      color: #fff;
      &:nth-child(1) {
        line-height: 24px;
        font-size: 14px;
      }
      &:nth-child(2) {
        line-height: 24px;
        opacity: 0.5;
        font-size: 12px;
        margin-bottom: 8px;
      }
    }
  }
}
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
  border-bottom: 8px solid #4876B3;
}
</style>
