<template>
  <Dialog title="最强准确率比较" :isShow='settingFlag' :hasPadding="false" :showBtn="true" @cancel='cancelHandler' @confirm="confirmHandler">
    <div class="tips">请输入自定义比例后，点击“计算”获取结果。</div>
    <div class="accuracy-panel">
      <div class="setting-item">
        <div class="title">比例</div>
        <div class="rate" v-for="(item, index) in rateList" :key="index">{{item}}%</div>
        <div class="rate" v-if="selfValue">{{selfValue}}%</div>
      </div>
      <div class="setting-item">
        <div>准确率</div>
        <div v-for="(item, index) in accuracyList" :key="index">{{item}}</div>
        <div>{{custom}}</div>
      </div>
      <div class="underline">使用自定义比例计算</div>
      <div class="setting">
        设定比例
        <input v-model="selfValue" placeholder="请输入">%
      </div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/dialog/index.vue';
import { mapState } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      selfValue: '',
      rateList: ['5', '10', '15', '20'],
      accuracyList: [],
      custom: ''
    };
  },
  props: {
    settingFlag: {
      type: Boolean,
      default: false
    },
    dataSource: {
      type: String
    }
  },
  components: {
    Dialog
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('result', ['outputItem'])
  },
  watch: {
    selfValue (value) {
      if (isNaN(value)) {
        this.selfValue = '';
      } else {
        // 改成输入大于0
        if (value < 0) {
          this.selfValue = '';
        } else if (value > 100) {
          this.selfValue = 100;
        }
      }
    }
  },
  mounted () {
    this.strongAccuracy();
  },
  methods: {
    async strongAccuracy () {
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        dataset: this.dataSource,
        sampling: this.outputItem.sampling
      };
      let res = await get('strongAccuracy', params);
      if (res.code === 0) {
        this.accuracyList.push((res.top5 * 100).toFixed(2) + '%');
        this.accuracyList.push((res.top10 * 100).toFixed(2) + '%');
        this.accuracyList.push((res.top15 * 100).toFixed(2) + '%');
        this.accuracyList.push((res.top20 * 100).toFixed(2) + '%');
      }
    },
    async confirmHandler () {
      if (!this.selfValue) {
        this.$message({
          message: '请输入比例',
          type: 'warning'
        });
        return;
      }
      let param = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        dataset: this.dataSource,
        sampling: this.outputItem.sampling,
        custom_ratio: this.selfValue / 100
      };
      let res = await get('strongAccuracy', param);
      if (res.code === 0) {
        this.custom = (res.custom * 100).toFixed(2) + '%';
        this.$emit('confirm');
      }
    },
    cancelHandler () {
      this.$emit('cancel');
    }
  }
};
</script>
<style lang='scss' scoped>
.tips {
  padding: 8px 16px;
  color: #A4A4A4;
  font-size: 12px;
}
.accuracy-panel {
  width: calc(100% - 32px);
  height: 306px;
  padding: 16px;
  background: #2B2B2B;
  .setting-item {
    display: flex;
    color: #FCF8DF;
    font-size: 16px;
    padding: 38px 0px 0px 0px;
    &:first-child {
      // border-bottom: 2px solid #424242;
      padding: 12px 0px 38px 0px;
    }
    >div {
      width: 100px;
      line-height: 40px;
      text-align: center;
      position: relative;
    }
    >div:first-child {
      width: 120px;
      line-height: 40px;
      text-align: center;
      color: #F6B421;
      position: relative;
    }
    .title {
      width: 120px;
      line-height: 40px;
      text-align: center;
      color: #F6B421;
      position: relative;
      &::after {
        content: '';
        height: 2px;
        width: 120px;
        background: #424242;
        position: absolute;
        left: 0px;
        bottom: -40px;
      }
    }
    .rate {
      width: 100px;
      line-height: 40px;
      text-align: center;
      position: relative;
      &::after {
        content: '';
        height: 2px;
        width: 100px;
        background: #424242;
        position: absolute;
        left: 0px;
        bottom: -40px;
      }
      &::before {
        content: '';
        height: 16px;
        width: 2px;
        background: #F6B421;
        position: absolute;
        left: 46px;
        top: 71px;
        z-index: 2;
      }
    }
  }
  .underline {
    margin-top: 24px;
    line-height: 32px;
    position: relative;
    &::after {
      content: '';
      height: 1px;
      width: 42px;
      background: #F6B421;
      position: absolute;
      left: 0px;
      bottom: 0px;
    }
  }
  .setting {
    margin-top: 24px;
    >input {
      height: 40px;
      width: 96px;
      border-radius: 4px;
      box-sizing: border-box;
      background: #333333;
      border: 1px solid #F6B421;
      padding: 0px 8px;
      color: #fff;
      margin: 0px 8px 0px 48px;
    }
  }
}
</style>
