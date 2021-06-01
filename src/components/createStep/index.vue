<template>
  <div class="step">
    <div class="step-content">
      <div class="step-list" v-for="(item, index) in stepList" :key="index">
        <span class="iconfont icon-db_check" :class="showBg(index)" v-if="!showIcon"></span>
        <span class="iconfont icon-db_check" :class="showBg(index)" v-if="showIcon && index !== 2"></span>
        <span class="iconfont" :class="showWarningBg(index)" v-if="showIcon && index === 2"></span>
        <span class="step-name"  :class="select===index ? 'active' : ''">{{ item }}</span>
      </div>
    </div>
    <span class="btn" v-if="isNext" @click="nextClick">下一步</span>
    <span class="btn" v-if="isCreate && type === 'modeling'" @click="modelingClick">开始建模</span>
    <span class="btn" v-if="isCreate && type !== 'modeling'" @click="createClick">开始创建</span>
    <span class="btn" v-if="isPre" @click="preClick">上一步</span>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      code: 2
    };
  },
  props: {
    stepList: {
      type: Array
    },
    select: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: ''
    },
    stepSelcted: {
      type: Array
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('modeling', ['stepName', 'modeType', 'cutDataType']),
    isPre () {
      if (this.type === 'modeling') {
        return this.select !== 0;
      } else {
        return this.select !== 0 && this.select !== 1;
      }
    },
    isNext () {
      return this.select !== this.stepList.length - 1;
    },
    isCreate () {
      return this.select === this.stepList.length - 1;
    }
  },
  methods: {
    showBg (index) {
      if (this.select > index) {
        return 'bgActive';
      }
    },
    showWarningBg (index) {
      if (this.modeType === 'manual') {
        if (this.cutDataType === 'normal') {
          return 'bgWaiting  icon-db_minus';
        } else if (this.cutDataType === 'success') {
          return 'bgActive  icon-db_check';
        } else if (this.cutDataType === 'warning') {
          return 'bgWaiting  icon-db_minus';
        }
      } else {
        if (this.select > index) {
          return 'bgActive  icon-db_check';
        } else {
          return 'icon-db_check';
        }
      }
    },
    nextClick () {
      this.$emit('next');
    },
    createClick () {
      this.$emit('create');
    },
    preClick () {
      this.$emit('pre');
    },
    modelingClick () {
      this.$emit('modeling');
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
    .icon-db_check, .icon-db_minus {
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
  .bgActive {
    background: #91BA38 !important;
  }
  .bgWaiting {
    background: #F59E28 !important;
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
