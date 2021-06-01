<template>
  <Dialog title="阈值设置" :isShow='thresholdFlag' :hasPadding="false" :showBtn="true" @cancel='cancelHandler' @confirm="confirmHandler">
    <div class="tips">更改设置将刷新图表。</div>
    <div class="threshold-panel">
      <div class="threshold-item" :class="thresholdValue === '0' ? 'isActive' : ''" @click.stop="selectHandler('0')">
        <el-radio v-model="thresholdValue" label="0">默认阈值（0.5）</el-radio>
      </div>
      <div class="threshold-item" :class="thresholdValue === '1' ? 'isActive' : ''" @click.stop="selectHandler('1')">
        <el-radio v-model="thresholdValue" label="1">按实际 1 的分布进行阈值选择</el-radio>
      </div>
      <div class="threshold-item" :class="thresholdValue === '2' ? 'isActive' : ''" @click.stop="selectHandler('2')">
        <el-radio v-model="thresholdValue" label="2">按敏感性和特异性最大化进行阈值选择</el-radio>
      </div>
      <div class="threshold-item" :class="thresholdValue === '3' ? 'isActive' : ''" @click.stop="selectHandler('3')">
        <el-radio v-model="thresholdValue" label="3">自定义比例</el-radio>
        <input class="input" :class="thresholdValue === '3' ? 'isbgActive' : ''" v-model="selfValue" />%
      </div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/dialog/index.vue';
import { mapMutations, mapState } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      thresholdValue: '0',
      selfValue: '',
      selectObj: ['FIX_HALF', 'TRUE_RATIO', 'SENS_SPEC_MAX', 'CUSTOM_RATIO'],
      selectList: ['使用默认阈值', '按实际1的分布进行阈值选择', '按敏感性和特异性最大化进行阈值选择', '阈值']
    };
  },
  props: {
    thresholdFlag: {
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
    selfValue (val) {
      if (isNaN(val)) {
        this.selfValue = '';
      } else {
        if (val < 0) {
          this.selfValue = '';
        } else if (val > 100) {
          this.selfValue = 100;
        }
      }
    }
  },
  methods: {
    ...mapMutations('result', ['setMatrixObj']),
    selectHandler (val) {
      if (this.thresholdValue === val) return;
      this.thresholdValue = val;
    },
    async confirmHandler () {
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        dataset: this.dataSource,
        sampling: this.outputItem.sampling,
        cutoff_type: this.selectObj[this.thresholdValue]
      };
      if (this.thresholdValue === '3') {
        if (!this.selfValue) {
          this.$message({
            message: '请输入自定义比例',
            type: 'warning'
          });
          return;
        }
        params.custom_ratio = this.selfValue / 100;
      }
      let res = await get('confusionMatrix', params);
      if (res.code === 0) {
        let obj = {
          tLeft: res.tp,
          tRight: res.fn,
          bLeft: res.fp,
          bRight: res.tn
        };
        this.setMatrixObj(obj);
        this.$emit('confirm', res.cutoff, this.selectList[this.thresholdValue], `${this.selfValue}%`);
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
.threshold-panel {
  width: calc(100% - 32px);
  height: 306px;
  padding: 16px;
  background: #2B2B2B;
  .threshold-item {
    height: 48px;
    line-height: 48px;
    padding: 0px 24px;
    border-radius: 4px;
    background: #444444;
    margin-bottom: 16px;
    .input {
      width: 80px;
      height: 36px;
      line-height: 36px;
      border: none;
      border-radius: 4px;
      padding: 0px 5px;
      outline: none;
      color: #fff;
      background: #333;
      margin-right: 12px;
    }
  }
  .isActive {
    border: 1px solid #F6B421;
    background: #333;
  }
  .isbgActive {
    background: #444444 !important;
  }
}
</style>
