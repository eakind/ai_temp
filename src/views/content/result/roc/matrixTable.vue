<template>
  <div class="matrix-table">
    <div class="title">混淆矩阵</div>
    <div class="matrix-body">
      <div class="result-title">模型结果</div>
      <div class="result-table">
        <div class="actual">实际分布</div>
        <div class="table">
          <span class="up-left">1</span>
          <span class="up-right">0</span>
          <span class="left-up">1</span>
          <span class="left-down">0</span>
          <div class="table-row">
            <div class="item item-bottom">{{matrixObj.tLeft}}</div>
            <div class="item item-bottom">{{matrixObj.tRight}}</div>
          </div>
          <div class="table-row">
            <div class="item">{{matrixObj.bLeft}}</div>
            <div class="item">{{matrixObj.bRight}}</div>
          </div>
        </div>
      </div>
      <div class="result-title">1 = {{rocMap[1]}}, 0 = {{rocMap[0]}}</div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      rocMap: {}
    };
  },
  props: {
    dataSource: {
      type: String
    }
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('result', ['outputItem', 'matrixObj'])
  },
  watch: {
    dataSource () {
      this.auc();
    },
    outputItem: {
      handler (obj) {
        this.auc();
      },
      deep: true
    }
  },
  mounted () {
    this.auc();
    this.getTargetModel();
  },
  methods: {
    ...mapMutations('result', ['setMatrixObj']),
    async auc () {
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        dataset: this.dataSource,
        sampling: this.outputItem.sampling
      };
      let res = await get('auc', params);
      if (res.code === 0) {
        let obj = {
          tLeft: res.tp,
          tRight: res.fn,
          bLeft: res.fp,
          bRight: res.tn
        };
        this.setMatrixObj(obj);
        this.$emit('setAuc', res.roc_auc);
      } else {
        let obj = {
          tLeft: 0,
          tRight: 0,
          bLeft: 0,
          bRight: 0
        };
        this.setMatrixObj(obj);
      }
    },
    async getTargetModel () {
      let params = {
        project_id: this.projectId
      };
      let res = await get('getTargetModel', params);
      if (res.code === 0) {
        this.$set(this.rocMap, 0, 0);
        this.$set(this.rocMap, 1, 1);
        if (res.target_mapping) {
          let obj = res.target_mapping;
          if (!obj) return;
          for (let key of Object.keys(obj)) {
            this.$set(this.rocMap, obj[key], key.length > 7 ? key.slice(0, 5) + '...' : key);
          }
        }
      }
    }
  }
};
</script>
<style lang='scss' scoped>
@mixin txt {
  position: absolute;
  font-size: 18px;
  color: #FCF8DF;
}
.matrix-table {
  height: 100%;
  width: 100%;
  padding: 16px 0px;
  .title {
    height: 32px;
    line-height: 32px;
    position: relative;
    &::after {
      content: '';
      display: inline-block;
      height: 1px;
      width: 50px;
      background: #F6B421;
      position: absolute;
      left: 0px;
      bottom: 0px;
    }
  }
  .matrix-body {
      width: 368px;
      margin: 0 auto;
    .result-title {
      width: 192px;
      height: 32px;
      line-height: 32px;
      color: #FCF8DF;
      background: #333;
      text-align: center;
      border-radius: 4px;
      margin: 0 auto;
    }
    .result-table {
      display: flex;
      justify-content: center;
      position: relative;
      .actual {
        width: 22px;
        height: 192px;
        padding: 3px 5px;
        background: #333;
        color: #FCF8DF;
        border-radius: 4px;
        text-align: center;
        writing-mode: tb-rl;
        position: absolute;
        top: 110px;
        left: -116px;
      }
      .table {
        position: relative;
        margin: 50px 0px 16px 0px;
        .up-left {
          top: -35px;
          left: 75px;
          @include txt;
        }
        .up-right {
          top: -35px;
          left: 286px;
          @include txt;
        }
        .left-up{
          left: -45px;
          top: 65px;
          @include txt;
        }
        .left-down{
          left: -45px;
          top: 250px;
          @include txt;
        }
        .table-row {
          display: flex;
          align-items: center;
          .item {
            height: 160px;
            width: 160px;
            border-radius: 4px;
            background: #333333;
            color: #F6B421;
            font-size: 20px;
            font-weight: bold;
            margin-right: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            &:nth-child(even) {
              margin-right: 0px;
            }
          }
          .item-bottom {
            margin-bottom: 24px;
          }
        }
      }
    }
  }
}
</style>
