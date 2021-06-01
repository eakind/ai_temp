<template>
  <Dialog title="数据切割设置" :isShow='dialogFlag' :showBtn="true" :hasPadding="false" @cancel='cancelHandler' @confirm="confirmHandler">
    <div class="tips">更改设置将进入任务进程。数据比例将在任务进程完成后自动更新。</div>
    <div class="type-name">{{setPartitionType}}</div>
    <div class="panel">
      <random-type :detailData="detailData" @change="inputChange" v-if="partitionType === 'STRATIFY' || partitionType === 'RANDOM'"></random-type>
      <time-type :detailData="detailData" @select="selectFeature" @typeChange="changeMissingType" @change="valueChange" v-if="partitionType === 'NUMERICAL' || partitionType === 'TIME'" :partitionType="partitionType"></time-type>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/dialog/index.vue';
import RandomType from './randomType.vue';
import TimeType from './timeType.vue';
export default {
  data () {
    return {
      validation: '',
      cvFolds: '',
      holdout: '',
      selectFeaIdx: null,
      missingType: 'ISOLATION_SET',
      firstValue: null,
      secondValue: null
    };
  },
  props: {
    detailData: {
      type: Object
    },
    dialogFlag: {
      type: Boolean,
      default: false
    },
    partitionType: {
      type: String
    }
  },
  components: {
    Dialog,
    RandomType,
    TimeType
  },
  computed: {
    setPartitionType () {
      let str = '';
      switch (this.partitionType) {
        case 'RANDOM':
          str = '随机抽样';
          break;
        case 'STRATIFY':
          str = '分层抽样';
          break;
        case 'NUMERICAL':
          str = '数值切割';
          break;
        case 'TIME':
          str = '时间切割';
          break;
      }
      return str;
    }
  },
  watch: {
    detailData: {
      handler (list) {
        this.cvFolds = list.validation_percent;
        this.holdout = list.holdout_percent;
        this.validation = 100 - (Number(this.holdout) + Number(this.cvFolds));
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
  },
  methods: {
    inputChange (validation, cvFolds, holdout) {
      this.validation = validation;
      this.cvFolds = cvFolds;
      this.holdout = holdout;
    },
    selectFeature (item) {
      this.selectFeaIdx = item.feature_idx;
    },
    changeMissingType (val) {
      this.missingType = val;
    },
    valueChange (firstValue, secondValue) {
      this.firstValue = firstValue;
      this.secondValue = secondValue;
    },
    confirmHandler () {
      if (this.partitionType === 'NUMERICAL' || this.partitionType === 'TIME') {
        if (!this.selectFeaIdx) {
          this.$message({
            message: '请选择字段',
            type: 'warning'
          });
          return;
        }
      }
      if (this.partitionType === 'STRATIFY' || this.partitionType === 'RANDOM') {
        if (!this.validation) {
          this.$message({
            message: '请输入训练集区间值',
            type: 'warning'
          });
          return;
        }
        if (!this.cvFolds) {
          this.$message({
            message: '请输入测试集区间值',
            type: 'warning'
          });
          return;
        }
        if (!this.holdout) {
          this.$message({
            message: '请输入隔离集区间值',
            type: 'warning'
          });
          return;
        }
      }
      this.$emit('confirm', this.validation, this.cvFolds, this.holdout, this.selectFeaIdx, this.firstValue, this.secondValue, this.missingType);
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
.type-name {
  padding: 0px 16px;
}
.panel {
  margin-top: 16px;
  padding: 16px 16px;
  height: 264px;
  background: #2B2B2B;
}
</style>
