<template>
  <div class="step">
    <div class="step-content">
      <div class="step-list" v-for="(item, index) in stepList" :key="index">
        <span class="iconfont icon-db_check"></span>
        <span class="step-name"  :class="select===index ? 'active' : ''">{{ item }}</span>
      </div>
    </div>
    <span class="btn" v-if="isNext" @click="nextClick">下一步</span>
    <span class="btn" v-if="isCreate" @click="createClick">开始创建</span>
    <span class="btn" v-if="isPre" @click="preClick">上一步</span>
  </div>
</template>
<script>
export default {
  data () {
    return {};
  },
  props: {
    stepList: {
      type: Array
    },
    select: {
      type: Number,
      default: 0
    }
  },
  computed: {
    isPre () {
      return this.select !== 0 && this.select !== 1;
    },
    isNext () {
      return this.select !== this.stepList.length - 1;
    },
    isCreate () {
      return this.select === this.stepList.length - 1;
    }
  },
  methods: {
    nextClick () {
      this.$emit('next');
    },
    createClick () {
      this.$emit('create');
    },
    preClick () {
      this.$emit('pre');
    }
  }
};
</script>
<style lang='scss' scoped>
.step {
  margin-top: 10px;
  overflow: hidden;
}
.step-content {
  float: left;
  display: flex;
  align-content: center;
  .step-list {
    .icon-db_check {
      display: inline-block;
      height: 14px;
      width: 14px;
      background: #222222;
      border-radius: 50%;
      margin-right: 5px;
      font-size: 12px;
      color: #666666;
    }
    .step-name {
      color: #A4A4A4;
      position: relative;
      margin-right: 30px;
      &::after {
        content: '';
        height: 2px;
        width: 8px;
        background: #F6B421;
        position: absolute;
        top: 6px;
        right: -18px;
      }
    }
    &:last-child {
      .step-name::after {
        display: none;
      }
    }
  }
  .active {
    color: #F6B421 !important;
  }
}
.btn {
  display: inline-block;
  width: 80px;
  text-align: center;
  float: right;
  color: #F6B421;
  font-size: 14px;
  margin-left: 24px;
  cursor: pointer;
}
</style>
