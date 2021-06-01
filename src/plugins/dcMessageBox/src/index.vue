<template>
  <div class="ui-message-box-wrap" v-if="show">
    <div class="ui-message-box-box">
      <div v-if="title" class="title">
        {{title}}
        <span class="iconfont icon-db_plus" @click="show=false"></span>
      </div>
      <div v-if="secondTitle" class="second-title">
        {{secondTitle}}
      </div>
      <div class="content" :class="inputObj.show?'no-padding':''">
        <div :class="['message',center?'center':'']" v-if="message">{{message}}</div>
        <template v-if="inputObj.show">
          <input :type="inputObj.text" v-model="inputObj.value" :placeholder="placeHolder" />
        </template>
        <template v-else-if="contentHtml">
          <div v-html="contentHtml"></div>
        </template>
      </div>
      <div class="error" v-if="errorTipsShow">{{inputObj.inputErrorText}}</div>
      <div class="footer btn-group">
        <button class="sure" v-if="showConfirmButton" @click="confirm">{{confirmText}}</button>
        <button class="cancel" @click="cancel">{{cancelText}}</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      title: '',
      secondTitle: '',
      placeHolder: '',
      message: '',
      show: false,
      showConfirmButton: true,
      confirmText: '确定',
      cancelText: '取消',
      center: false,
      inputObj: {
        show: false,
        value: '',
        inputPattern: '',
        inputErrorText: '',
        type: 'text'
      },
      callBack: null,
      callBackCancel: null,
      errorTipsShow: false,
      contentHtml: '' // 自定义的content
    };
  },
  methods: {
    confirm () {
      if (this.inputObj.show) {
        this.callBack(this.inputObj.value);
        return;
      }
      this.callBack();
    },
    cancel () {
      this.show = false;
      if (this.callBackCancel) {
        this.callBackCancel();
      }
    }
  }
};
</script>
<style scoped lang='scss'>
.ui-message-box-wrap {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  font-family: "siyuanheiti";
  background: rgba($color: #000000, $alpha: 0.4);
  font-size: 14px;
  color: #fff;
  .ui-message-box-box {
    position: absolute;
    width: 420px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: "siyuanheiti";
    box-shadow: 0 24px 56px 0 rgba(0,0,0,0.10), 0 4px 14px 0 rgba(0,0,0,0.10);
    border-radius: 4px;
    background: #222222;
    padding: 14px 16px;
    .title {
      position: relative;
      font-family: "siyuanheiti";
      color: #F6B421;
      .icon-db_plus{
        color: #fff;
        cursor: pointer;
        transform: rotate(45deg);
        display: inline-block;
        right: 0px;
        top: 0px;
        position: absolute;
      }
    }
    .second-title{
      line-height: 36px;
      padding: 18px 16px 8px;
      font-size: 14px;
      font-family: "siyuanheiti";
      display: inline-block;
    }
    .content {
      padding: 25px 10px;
      margin: 16px 0px;
      border-radius: 4px;
      font-family: "siyuanheiti";
      background: #333333;
      .message {
        font-size: 14px;
        font-family: "siyuanheiti";
        padding-bottom: 9px;
      }
      .message.center {
        line-height: 25px;
        text-align: center;
        font-family: "siyuanheiti";
      }
      input {
        width: calc(100% - 10px);
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        outline: none;
        border: none;
        border-radius: 4px;
        padding: 0px 10px;
        font-size: 14px;
        background-color: transparent;
        background: #333;
        color: #cccccc;
      }
    }
    .no-padding{
      padding: 0px;
      margin: 0px 16px 16px;
    }
    .error {
      color: #f56c6c;
      font-size: 12px;
      min-height: 18px;
      margin-top: 2px;
      padding: 5px 10px;
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
