<template>
  <div class="item">
    <div class="top">
      <div :class="status === 'active' ? 'active-type' : 'waiting-type'">
        <span>{{item.job_type}}</span>
        <span class="iconfont icon-db_plus" @click="cancel"></span>
      </div>
      <div>
        <span>{{ item.project_name }}</span>
        <span>{{setModelName(item.model_type)}}</span>
      </div>
    </div>
    <div class="bottom" :class="status === 'active' ? 'active-bottom' : 'waiting-bottom'">
      <span>{{status === 'active' ? '处理中' : '等待中'}}</span>
    </div>
  </div>
</template>
<script>
import { taskMixin } from '../content/mixins/taskMixin.js';
export default {
  data () {
    return {};
  },
  mixins: [taskMixin],
  props: {
    item: {
      type: Object,
      default: _ => {}
    },
    index: {
      type: Number
    },
    status: {
      type: String,
      default: 'active'
    }
  },
  mounted () {
  },
  methods: {
  }
};
</script>
<style lang='scss' scoped>
.item {
  height: 80px;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  background: #222222;
  .top {
    height: 56px;
    padding: 0px 8px;
    width: calc(100% - 16px);
    >div {
      display: flex;
      align-content: center;
      justify-content: space-between;
      height: 28px;
      line-height: 28px;
      box-sizing: border-box;
    }
    .active-type {
      >span:nth-child(1) {
        color: white;
        background:linear-gradient(90deg, #89F7FE 0%, #66A6FF 100%);
        background-clip: text;
        color: transparent;
        font-weight: bold;
      }
      >span:nth-child(2) {
        display: inline-block;
        transform: rotate(45deg);
        font-weight: bold;
        cursor: pointer;
      }
    }
    .waiting-type {
      >span:nth-child(1) {
        color: #FCF8DF;
        font-weight: bold;
      }
      >span:nth-child(2) {
        display: inline-block;
        transform: rotate(45deg);
        font-weight: bold;
        cursor: pointer;
        color: #F6B421;
      }
    }
    >div:nth-child(2) {
      >span:nth-child(2) {
        color: #fff;
        opacity: 0.5;
      }
    }
  }
  .bottom {
    height: 24px;
    line-height: 24px;
    padding: 0px 8px;
    width: calc(100% - 16px);
    border-radius: 0px 0px 4px 4px;
    >span {
      color: #fff;
      font-size: 12px;
    }
  }
  .active-bottom {
    background: linear-gradient(90deg, rgba($color: #89F7FE, $alpha: 0.5) 0%, rgba($color: #66A6FF, $alpha: 0.5) 100%);
  }
  .waiting-bottom {
    background: linear-gradient(90deg, rgba($color: #F6B421, $alpha: 0.5) 0%, rgba($color: #483F2A, $alpha: 0.5) 100%);
  }
}
</style>
