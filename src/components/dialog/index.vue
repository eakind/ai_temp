<template>
  <div class="dialog-wrap" v-if="isShow">
    <div class="dialog-box" :style="`width: ${ width }px`">
      <div class="header">
        {{ title }}
        <span class="iconfont icon-db_plus" @click="cancel"></span>
      </div>
      <div :class="hasPadding ? 'has-padding' : ''">
        <slot></slot>
      </div>
      <div class="footer btn-group" v-if="showBtn">
        <button class="sure" @click="confirm">{{confirmText}}</button>
        <button class="cancel" @click="cancel">{{cancelText}}</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {};
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 768
    },
    title: {
      type: String,
      default: ''
    },
    showBtn: {
      type: Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    hasPadding: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    confirm () {
      this.$emit('confirm');
    },
    cancel () {
      this.$emit('cancel');
    }
  }
};
</script>
<style lang='scss' scoped>
.dialog-wrap {
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
  z-index: 2;
  .dialog-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: "siyuanheiti";
    box-shadow: 0 24px 56px 0 rgba(0,0,0,0.10), 0 4px 14px 0 rgba(0,0,0,0.10);
    border-radius: 4px;
    background: #222222;
    padding: 14px 0px;
    .header {
      position: relative;
      font-family: "siyuanheiti";
      color: #F6B421;
      padding: 0px 16px;
      .icon-db_plus{
        color: #fff;
        cursor: pointer;
        transform: rotate(45deg);
        display: inline-block;
        right: 16px;
        top: 0px;
        position: absolute;
      }
    }
    .has-padding {
      padding: 0px 16px;
    }
    .btn-group {
      padding: 5px 15px 0;
      text-align: center;
      line-height: 40px;
      button {
        appearance: none;
        outline: none;
        border: none;
        background-color: transparent;
        cursor: pointer;
        font-size: 14px;
        padding-top: 9px;
        padding-bottom: 9px;
        min-width: 120px;
      }
      .sure {
        margin-right: 40px;
        color: #F6B421;
      }
      .cancel {
        color: #A4A4A4;
      }
      button:hover {
        border-radius: 4px;
      }
    }
  }
}
</style>
