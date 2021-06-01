<template>
  <Dialog title="分数映射" :isShow='settingFlag' :hasPadding="false" :showBtn="true" @cancel='cancelHandler' @confirm="confirmHandler">
    <div class="tips">更改设置将刷新分数段表现。</div>
    <div class="setting-panel">
      <div class="setting-item">
        <div class="title">基准分Score</div>
        <input type="Number" v-model="score" placeholder="请输入" class="input">
      </div>
      <div class="setting-item">
        <div class="title">基准分下坏样本比例 odds</div>
        <input v-model="odds" placeholder="请输入" class="input">%
      </div>
      <div class="setting-item">
        <div class="title">坏样本翻倍所需分数 PDO</div>
        <input type="Number" v-model="pdo" placeholder="请输入" class="input">
      </div>
      <div class="check-item">
          <el-checkbox v-model="scoreAdjust">分数调整（分数越低，坏样本概率越高）</el-checkbox>
      </div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/dialog/index.vue';
import { post } from '@/api/server';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      score: '',
      odds: '',
      pdo: '',
      scoreAdjust: true
    };
  },
  props: {
    settingFlag: {
      type: Boolean
    }
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('result', ['outputItem'])
  },
  components: {
    Dialog
  },
  watch: {
    odds (value) {
      if (isNaN(value)) {
        this.odds = '';
      } else {
        if (value < 0) {
          this.odds = '';
        } else if (value > 100) {
          this.odds = 100;
        }
      }
    }
  },
  methods: {
    cancelHandler () {
      this.$emit('on-cancel');
    },
    async confirmHandler () {
      if (!this.score) {
        this.$message({
          message: '请输入基准分Score',
          type: 'warning'
        });
        return;
      }
      if (!this.odds) {
        this.$message({
          message: '请输入基准分下坏样本比例odds',
          type: 'warning'
        });
        return;
      }
      if (!this.pdo) {
        this.$message({
          message: '请输入坏样本翻倍所需分数PDO',
          type: 'warning'
        });
        return;
      }
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        sampling: this.outputItem.sampling,
        score: this.score,
        odds: this.odds,
        pdo: this.pdo,
        score_adjust: this.scoreAdjust
      };
      let res = await post('postScorePerformance', params);
      if (res.code === 0) {
        this.$emit('on-confirm');
      }
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
.setting-panel {
  padding: 8px 16px;
  color: #fff;
  font-size: 14px;
  background: #2B2B2B;
  height: 300px;
}
.setting-item {
  margin-bottom: 12px;
  .title {
    color: #FCF8DF;
    line-height: 36px;
  }
  .input {
    display: inline-block;
    width: 96px;
    height: 36px;
    line-height: 36px;
    padding: 0px 8px;
    border-radius: 4px;
    text-align: left;
    box-sizing: border-box;
    outline: none;
    font-size: 14px;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: #333333;
    border: 1px solid #F6B421;
    &:nth-child(2) {
      margin-right: 12px;
    }
  }
}
</style>
