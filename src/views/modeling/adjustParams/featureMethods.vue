<template>
  <Dialog title="数据切割设置" :isShow='dialogFlag' :showBtn="true" :hasPadding="false" @cancel='cancelHandler' @confirm="confirmHandler">
    <div class="tips">更改设置将进入任务进程。数据比例将在任务进程完成后自动更新。</div>
    <!-- <div class="model-name">模型名称：{{modelName}}</div> -->
    <div class="panel">
      <div class="item">
        <span>特征选择方式</span>
        <el-checkbox v-model="selectMethods.forward">前向特征选择</el-checkbox>
        <el-checkbox v-model="selectMethods.backwards">后向特征选择</el-checkbox>
      </div>
      <div class="item">
        <span>最大允许VIF</span>
        <input type="text" v-model="selectMethods.max_vif" placeholder="不输入则无限制">
      </div>
      <div class="item">
        <span>最大允许PSI</span>
        <input type="text" v-model="selectMethods.max_psi" placeholder="不输入则无限制">
      </div>
      <div class="item">
        <span>入模特征数</span>
        <input type="text" v-model="selectMethods.feature_num" placeholder="不输入则全部入模">
      </div>
      <div class="bottom-tips">* 最多可输入2个数值，请用“，”区分。例如：1，2</div>
      <div class="bottom-tips">填写多个时，以上设置将按组合方式进行特征工程，生成多个模型。</div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/dialog/index.vue';
export default {
  data () {
    return {
      type: 'auto'
    };
  },
  props: {
    dialogFlag: {
      type: Boolean,
      default: false
    },
    selectMethods: {
      type: Object
    },
    modelName: {
      type: String
    }
  },
  components: {
    Dialog
  },
  mounted () {},
  methods: {
    confirmHandler () {
      this.$emit('confirm', this.selectMethods);
    },
    cancelHandler () {
      this.$emit('cancel');
    }
  }
};
</script>
<style lang='scss' scoped>
.tips {
  color: #A4A4A4;
   font-size: 12px;
   line-height: 24px;
   padding: 8px 16px;
}
.model-name {
  padding: 0px 16px;
}
.panel {
  width: calc(100% - 32px);
  margin-top: 16px;
  height: 312px;
  padding: 8px 16px;
  background: #2B2B2B;
  .item {
    margin-top: 24px;
    margin-bottom: 24px;
    >span:nth-child(1) {
      display: inline-block;
      width: 120px;
    }
    > input {
      padding: 0px 8px;
      margin: 0px;
      height: 30px;
      width: 160px;
      outline: none;
      border: none;
      font-size: 14px;
      color: #fff;
      border-radius: 4px;
      background: #333333;
      border: 1px solid #F6B421;
    }
  }
  .bottom-tips {
    font-size: 12px;
    color: #A4A4A4;
  }
}
</style>
