<template>
  <div class="building">
    <div class="header">
      <div class="model-name">
        {{setModelName(modelType)}}
        <span>成功建立的模型结果将自动显示。处理中的模型/计算请点击“任务进程”查看。</span>
      </div>
      <div class="model-type">{{modelPatterns}}<span v-if="modelLearnMethod">（{{modelLearnMethod}}）</span></div>
    </div>
    <div class="model-panel" v-if="modelList.length">
      <div class="panel-header">
        <div>
          <span class="ranking-title">排行评价指标</span>
          <drop-list :list="list" :select="modelMetricName" class="drop-list" @on-change="changeHandler"></drop-list>
        </div>
        <div class="btn" v-if="hideHoldout" @click="predictHoldout">
          <span class="iconfont icon-db_unlock"></span>
          解除全部隔离集
        </div>
      </div>
      <div class="table">
        <div class="table-list">
          <span class="title" v-for="(item, hIndex) in headerList" :key="hIndex">{{item}}</span>
        </div>
        <div class="table-body">
          <div class="table-list" v-for="(item, lIndex) in modelList" :key="lIndex">
            <span>{{lIndex + 1}}</span>
            <span>{{desc(item)}}</span>
            <span>{{setFormat(item.validation_score)}}</span>
            <span>
              <span v-if="item.cv_status === 'SUCCEED'">{{setFormat(item.cv_score)}}</span>
              <span class="running-style" v-if="item.cv_status === 'PENDING'">处理中</span>
              <span class="failed-style" v-if="item.cv_status==='FAIL'">数据异常</span>
              <span class="icon" v-if="!item.cv_status" @click="trainCV(item, lIndex)"><span class="iconfont icon-db_arrow"></span>计算</span>
              <span v-if="item.cv_status==='DISABLED'">/</span>
            </span>
            <span>
              <span class="icon"  v-if="!item.holdout_status" @click="holdout(item, lIndex)"><span class="iconfont icon-db_lock"></span>解锁</span>
              <span class="running-style"  v-if="item.holdout_status === 'PENDING'">处理中</span>
              <span v-if="item.holdout_status==='SUCCEED'">{{setFormat(item.holdout_score)}}</span>
              <span v-if="item.holdout_status==='FAIL'" class="failed-style">数据异常</span>
            </span>
            <span @click="resultHandler(item)">
              <span  class="operate-btn">查看结果</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <loading-page v-if="isLoading && !modelList.length"></loading-page>
    <div class="result-tip" v-if="!modelList.length && isResult">
      <span class="iconfont icon-db10_aiNull"></span>
      暂无内容
    </div>
  </div>
</template>
<script>
import DropList from '@/components/dropList/index.vue';
import LoadingPage from '@/components/loadingPage/index.vue';
import { mapMutations, mapState } from 'vuex';
import { get, post } from '@/api/server';
import { numFormat } from '@/utils/format';
export default {
  data () {
    return {
      list: [],
      modelPatterns: '',
      modelLearnMethod: '',
      modelMetricName: '',
      modelMetricValue: '',
      headerList: ['Ranking', '名称', 'Validation', 'CV', 'Holdout', '操作'],
      modelList: [],
      direction: 'desc',
      orderBy: 'validation_score',
      isLoading: false,
      isResult: false,
      waitList: [],
      activeList: [],
      fistFlag: false,
      hideHoldout: false,
      modelScoreFlag: false
    };
  },
  components: {
    DropList,
    LoadingPage
  },
  computed: {
    ...mapState(['projectId', 'modelType']),
    ...mapState('status', ['modelDesc'])
  },
  beforeDestroy () {
    this.bus.$off('refreshModelList');
  },
  mounted () {
    this.setModelScoreParam(null);
    this.setOutputItem(null);
    this.getModelMetric();
    this.getModelPattrns();
    this.bus.$on('refreshModelList', () => {
      if (this.modelScoreFlag) return;
      this.modelScoreFlag = true;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.modelScoreList();
      }, 100);
    });
  },
  methods: {
    ...mapMutations('result', ['setModelScoreParam', 'setOutputItem']),
    setModelName (modelType) {
      if (modelType === 'BINARY_CLASS') {
        return '分类模型';
      } else if (modelType === 'REGRESSION') {
        return '回归模型';
      } else if (modelType === 'SCORECARD') {
        return '评分模型';
      } else if (modelType === 'GLM_BINARY_CLASS') {
        return 'GLM分类模型';
      } else if (modelType === 'GLM_REGRESSION') {
        return 'GLM回归模型';
      } else if (modelType === 'CLUSTERING') {
        return '聚类模型';
      } else {
        return '未知';
      }
    },
    async getModelMetric () {
      this.list = [];
      let params = {
        project_id: this.projectId,
        optimize_only: false
      };
      let res = await get('getMetricModel', params);
      if (res.code === 0) {
        let arr = res.metrics_list;
        if (arr.length) {
          for (let i in arr) {
            this.list.push({
              name: arr[i].metric_name,
              value: ''
            });
            if (arr[i].metric_code === res.optimize_metric) {
              this.modelMetricName = arr[i].metric_name;
              this.modelMetricValue = arr[i].metric_code;
            }
          }
          this.modelScoreList();
        }
      }
    },
    async getModelPattrns () {
      let params = {
        project_id: this.projectId
      };
      let res = await get('getModelPattrns', params);
      if (res.code === 0) {
        this.modelPatterns = res.modeling_patterns === 'AUTO' ? '自动建模' : '专家手动';
      }
    },
    async getModelLearnMethod () {
      let params = {
        project_id: this.projectId
      };
      let res = await get('getModelLearnMethod', params);
      if (res.code === 0) {
        this.modelLearnMethod = res.modeling_method === 'FAST' ? '快速学习' : '深度学习';
      }
    },
    async modelScoreList () {
      let params = {
        project_id: this.projectId,
        metric: this.modelMetricValue,
        order_by: this.orderBy,
        direction: this.direction
      };
      this.isLoading = true;
      this.isResult = false;
      this.setModelScoreParam(params);
      let res = await get('modelScoreList', params);
      this.isLoading = false;
      this.isResult = true;
      if (res.code === 0) {
        this.modelList = res.model_list;
        this.hideHoldout = false;
        this.modelScoreFlag = false;
        for (let i in this.modelList) {
          if (!this.modelList[i].holdout_status) {
            this.hideHoldout = true;
            break;
          }
        }
      }
    },
    desc (item) {
      return `${this.modelDesc[item.model_id]} (data${item.sampling})`;
    },
    setFormat (text) {
      return numFormat(text);
    },
    changeHandler (item) {},
    async trainCV (item, index) {
      let params = {
        project_id: this.projectId,
        model_id: item.model_id,
        sampling: item.sampling
      };
      if (item.cv_status) return;
      let res = await post('modelTrainCv', params);
      if (res.code === 0) {
        this.$set(this.modelList[index], 'cv_status', 'PENDING');
      }
    },
    async holdout (item, index) {
      let params = {
        project_id: this.projectId,
        model_id: item.model_id,
        sampling: item.sampling
      };
      if (item.holdout_status === 'PENDING') return;
      if (item.holdout_status === 'SUCCEED') return;
      let res = await post('predictHoldout', params);
      if (res.code === 0) {
        this.$set(this.modelList[index], 'holdout_status', 'PENDING');
      }
    },
    async predictHoldout () {
      let params = {
        project_id: this.projectId
      };
      let res = await post('predictHoldout', params);
      if (res.code === 0) {
        this.hideHoldout = false;
      }
    },
    resultHandler (item) {
      let obj = {
        name: `${this.modelDesc[item.model_id]} (data${item.sampling})`,
        value: item.model_id,
        modelType: this.modelType,
        ...item
      };
      this.setOutputItem(obj);
      this.$router.push({
        path: '/content/result'
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.building {
  height: 100%;
  width: 100%;
  .header{
    padding: 0px 24px;
    height: 80px;
    width: calc(100% - 48px);
    background: #2B2B2B;
    position: relative;
    .model-name {
      height: 40px;
      line-height: 40px;
      margin-left: 18px;
      font-size: 16px;
      color: #FCF8DF;
      font-weight: 600;
      >span {
        margin-left: 24px;
        font-size: 12px;
        color: #A4A4A4;
        font-weight: normal;
      }
    }
    .model-type {
      height: 24px;
      line-height: 24px;
      width: 152px;
      padding: 0px 4px;
      border-radius: 4px;
      background: #444444;
      opacity: 0.5;
      font-size: 12px;
      margin-left: 18px;
    }
    &::before {
      content: '';
      position: absolute;
      height: 72px;
      width: 8px;
      display: inline-block;
      border-radius: 0px 0px 2px 2px;
      background: linear-gradient(89.99deg, #F6B421 50%, #2b2b2b 100%);
    }
  }
  .model-panel {
    width: calc(100% - 128px);
    height: calc(100% - 100px);
    padding: 0px 104px 20px 24px;
    .panel-header {
      height: 48px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .ranking-title {
        font-weight: bold;
      }
      .drop-list {
        width: 192px;
        margin-left: 24px;
      }
      .btn {
        width: 160px;
        text-align: center;
        height: 36px;
        line-height: 36px;
        box-sizing: border-box;
        border-radius: 4px;
        background: #2B2B2B;
        border: 1px solid #444444;
        cursor: pointer;
      }
      .icon-db_unlock {
        color: #F6B421;
        margin-right: 6px;
      }
    }
    .table {
      width: 100%;
      height: calc(100% - 50px);
      .table-list {
        height: 36px;
        width: 100%;
        border-radius: 4px;
        background: #333333;
        margin-bottom: 8px;
        .title {
          color: white;
          background: linear-gradient(180deg, #89F7FE 0%, #66A6FF 100%);
          background-clip: text;
          color: transparent;
          font-weight: bold;
          &:nth-child(2) {
            text-align: center;
          }
        }
        >span {
          display: inline-block;
          line-height: 36px;
          width: 16%;
          text-align: center;
          @include ellipsis;
        }
        >span:nth-child(2) {
          text-align: left;
          width: 20%;
        }
      }
      .table-body {
        width: 100%;
        height: calc(100% - 44px);
        .operate-btn {
          height: 24px;
          line-height: 24px;
          width: 80px;
          display: inline-block;
          text-align: center;
          border-radius: 4px;
          margin: 0 auto;
          cursor: pointer;
          background: linear-gradient(180deg, #89F7FE 0%, #66A6FF 100%);
        }
        .icon {
          display: inline-block;
          width: 64px;
          text-align: center;
          height: 28px;
          line-height: 28px;
          border-radius: 4px;
          background: #222222;
          font-size: 12px;
          cursor: pointer;
          >span {
            font-size: 12px;
            margin-right: 8px;
            color: #F6B421;
          }
        }
        .running-style {
          color: #A4A4A4;
        }
        .failed-style {
          color: #f62121;
        }
      }
    }
  }
  .result-tip{
    color: #A0A0A0;
    margin-top: 200px;
    .icon-db10_aiNull{
      display: block;
      margin: auto;
      font-size: 22px;
     color: #A0A0A0;
    }
    text-align: center;
  }
}
</style>
