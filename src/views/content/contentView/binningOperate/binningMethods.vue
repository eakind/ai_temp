<template>
  <div class="binning-setting">
    <div class="tips">请设置边界和执行分箱的方式。上一步选择的特征将统一按设定进行分箱。  </div>
    <div class="setting-panel">
      <div class="top-panel">
        <div class="bottom-line">边界设定</div>
        <el-radio class="radio-box" v-model="borderValue" label="right">全局右包含 ( - ∞ , n ]</el-radio>
        <el-radio class="radio-box" v-model="borderValue" label="left">全局左包含 [ - n, ∞)</el-radio>
        <div class="bottom-line margin-style">入模特征选择</div>
        <el-radio class="radio-box" v-model="featureValue" label="false">原特征不入模</el-radio>
        <el-radio class="radio-box" v-model="featureValue" label="true">原特征入模</el-radio>
      </div>
      <div class="bottom-panel">
        请注意：通过分箱生成的新特征，无法再执行分箱。单个特征可通过“分箱调整”修改分箱设置。
      </div>
    </div>
    <div class="btns">
      <span class="next-btn" @click="pre()">上一步</span>
      <span class="next-btn" @click="confirm()">执行分箱</span>
      <span class="cancel-btn" @click="cancel()">取消</span>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { post } from '@/api/server';
export default {
  data () {
    return {
      borderValue: 'right',
      featureValue: 'false'
    };
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('content', ['binningAutoParams'])
  },
  components: {
  },
  methods: {
    async confirm () {
      console.log(this.featureValue);
      this.binningAutoParams.project_id = this.projectId;
      this.binningAutoParams.bound = this.borderValue;
      if (this.featureValue === 'true') {
        this.binningAutoParams.is_fit_feature = true;
      } else {
        this.binningAutoParams.is_fit_feature = false;
      }
      if (this.binningAutoParams.binning_type !== 'unsuperviser') {
        delete this.binningAutoParams.n_bins;
        delete this.binningAutoParams.strategy;
      }
      let res = await post('binningAuto', this.binningAutoParams);
      if (res.code === 0) {
        this.$emit('on-confirm');
      }
    },
    cancel () {
      this.$emit('on-cancel');
    },
    pre () {
      this.$emit('on-pre', 1);
    }
  }
};
</script>
<style lang='scss' scoped>
.binning-setting {
  color: #ffffff;
  font-size: 14px;
  .tips {
    padding: 8px 0px;
    color: #A4A4A4;
    font-size: 12px;
  }
  .setting-panel {
    background: #444444;
    padding: 16px;
    padding-bottom: 50px;
    border-radius: 4px;
    .top-panel {
      padding-bottom: 18px;
      border-bottom: 1px solid #666666;
    }
  }
  .bottom-line {
    position: relative;
    color: #FCF8DF;
    &::after {
      content: '';
      height: 1px;
      width: 26px;
      background: #F6B421;
      left: 0px;
      bottom: -5px;
      position: absolute;
    }
    > span {
      color: #A4A4A4;
      font-size: 12px;
      margin-left: 18px;
    }
  }
  .margin-style {
    margin-top: 24px;
  }
  .radio-box {
    margin: 18px 0px 12px 0px;
    display: block;
    width: 100%;
  }
  .bottom-panel {
    color: #A4A4A4;
    font-size: 12px;
    padding-top: 8px;
  }
  .btns {
    margin-top: 14px;
    line-height: 46px;
    display: flex;
    justify-content: center;
    >span {
      display: inline-block;
      width: 80px;
      margin: 0px 20px;
      cursor: pointer;
    }
    .next-btn {
      color: #F6B421;
    }
    .cancel-btn {
      color: #A4A4A4;
    }
  }
}
</style>
