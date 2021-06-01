<template>
  <div class="modify-pw">
    <div class="modify-content">
      <div class="content-header">
        <span>{{$t('modifyPassword')}}</span>
        <span class="iconfont icon-db_plus" @click="cancelHandler"></span>
      </div>
      <div class="content-row">
        <span>{{$t('oldPassword')}}</span>
        <input v-model="oldPassword" :placeholder="$t('oldPasswordTip')" />
      </div>
      <div class="content-row">
        <span>{{$t('newPassword')}}</span>
        <input v-model="newPassword" :placeholder="$t('newPasswordTip')" />
      </div>
      <div class="content-row">
        <span>{{$t('confirmPassword')}}</span>
        <input v-model="repeatPassword" :placeholder="$t('confirmPasswordTip')" />
      </div>
      <div class="content-footer">
        <span class="sure-btn" @click="sureHandler">{{$t('sure')}}</span>
        <span class="cancel-btn" @click="cancelHandler">{{$t('cancel')}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { post } from '@/api/server';
export default {
  data () {
    return {
      newPassword: '',
      oldPassword: '',
      repeatPassword: ''
    };
  },
  components: {
  },
  mounted () {
  },
  methods: {
    sureHandler () {
      if (!this.oldPassword) {
        this.$showTip({
          title: this.$t('oldPasswordTip'),
          type: 'error'
        });
        return;
      }
      if (!this.checkPassword(this.newPassword)) {
        this.$showTip({
          title: this.$t('passwordFormat'),
          type: 'error'
        });
        return;
      }
      if (this.newPassword === this.oldPassword) {
        this.$showTip({
          title: this.$t('passwordTip'),
          type: 'error'
        });
        return;
      }
      if (this.newPassword !== this.repeatPassword) {
        this.$showTip({
          title: this.$t('confirmPasswordTip'),
          type: 'error'
        });
        return;
      }
      this.modifyPw();
    },
    cancelHandler () {
      this.$emit('close');
    },
    checkPassword (name) {
      // eslint-disable-next-line no-useless-escape
      let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9`~!@#$%^&*()-_+={}|:"<>?[\];,.\']{8,16}$/;
      if (!reg.test(name)) {
        return false;
      }
      return true;
    },
    async modifyPw () {
      let param = {
        old_password: this.oldPassword,
        new_password: this.newPassword
      };
      let res = await post('security', param);
      if (res.code === 0) {
        localStorage.removeItem('dcAIUserToken');
        const url = localStorage.getItem('isLoginUrl') || '/dist-dcee/';
        localStorage.removeItem('isLoginUrl');
        window.location.href = url;
      } else {
        this.$showTip({
          title: this.$t(res.code),
          type: 'error'
        });
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.modify-pw{
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 102;
  @include bgColor('maskColor');
  position: absolute;
  .modify-content {
    width: 400px;
    height: 400px;
    left: 50%;
    top: 50%;
    padding: 20px;
    box-sizing: border-box;
    transform: translate(-50%, -50%);
    position: absolute;
    @include bgColor('bgColor');
    box-shadow: 0 24px 56px 0 rgba(0,0,0,0.10), 0 4px 14px 0 rgba(0,0,0,0.10);
    .content-header{
      font-size: 16px;
      height: 40px;
      padding: 5px;
      border-radius: 4px;
      box-sizing: border-box;
      @include fColor('mColor1');
      position: relative;
      .icon-db_plus {
        right: 10px;
        cursor: pointer;
        transform: rotate(45deg);
        display: inline-block;
        position: absolute;
      }
    }
    .content-row {
      width: 100%;
      padding: 5px 0px;
      > span {
        display: block;
        height: 40px;
        @include fColor('mColor2');
        line-height: 40px;
      }
      > input {
        border: none;
        border-radius: 4px;
        height: 40px;
        width: 100%;
        line-height: 40px;
        outline: none;
        margin: 0px;
        padding: 0px 5px;
        font-size: 16px;
        box-sizing: border-box;
        @include fColor('mColor3');
        @include bgColor('bColor2');
        &::placeholder {
          @include fColor('fColor4');
        }
      }
    }
    .content-footer{
      padding: 5px 0px;
      position: relative;
      height: 40px;
      .sure-btn {
        cursor: pointer;
        padding: 5px 10px;
        display: inline-block;
        @include fColor('mColor1');
        position: absolute;
        left: 100px;
        top: 15px;
      }
      .cancel-btn {
        cursor: pointer;
        padding: 5px 10px;
        display: inline-block;
        @include fColor('fColor1');
        right: 100px;
        top: 15px;
        position: absolute;
      }
    }
  }
}
</style>
