<template>
  <div class="confirm-infor">
    <div class="title">确认信息</div>
    <div class="tips">请确认以下信息后点击“开始创建”</div>
    <div class="content">
      <div class="list">
        <span>目标特征</span>
        <span v-if="detailInfor">{{detailInfor.target_feature_name}}</span>
      </div>
      <div class="list position-style">
        <span>参与建模特征</span>
        <span><span @click="infoClick" v-click-out="hideHandler">查看列表</span></span>
        <div class="tips-box" v-if="infoFlag">
          <div class="tip-panel">
            <template v-for="(item, index) in list">
              <div class="infor-list" :key="index">{{item}}</div>
            </template>
            <div class="top-icon"></div>
          </div>
        </div>
      </div>
      <div class="list">
        <span>建模模式</span>
        <span v-if="detailInfor">{{detailInfor.modeling_patterns === 'AUTO' ? '自动建模' : '专家手动'}}</span>
      </div>
      <div class="list">
        <span>模型类型</span>
        <span v-if="detailInfor">{{setModelName(detailInfor.model_type)}}</span>
      </div>
      <div class="list" v-if="modeType === 'manual'">
        <span>切割方式</span>
        <span v-if="detailInfor">{{setPartitionMethod(detailInfor.partition_method)}}</span>
      </div>
      <div class="list" v-if="modeType === 'manual'">
        <span>划分数据集</span>
        <span v-if="detailInfor">
          训练集{{100 - Number(detailInfor.holdout_percent) - Number(detailInfor.validation_percent)}}%，
          测试集{{Number(detailInfor.validation_percent)}}%，隔离集{{Number(detailInfor.holdout_percent)}}%
        </span>
      </div>
      <div class="list" v-if="modeType === 'manual'">
        <span>模型调参</span>
        <span v-if="detailInfor">
          <div v-for="(item, idx) in detailInfor.select_model_data" :key="idx">{{item}}{{detailInfor.model_param_default ? '（默认）' : '（自定义）'}}</div>
        </span>
      </div>
      <div class="list">
        <span>学习方式</span>
        <span v-if="detailInfor">{{detailInfor.modeling_method === 'FAST' ? '快速学习' : '深度学习'}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
// import { getFeatureList } from '../content/mixins/getFeatureList.js';
import { get } from '@/api/server';
export default {
  data () {
    return {
      infoFlag: false,
      list: [],
      detailInfor: null
    };
  },
  // mixins: [getFeatureList],
  computed: {
    ...mapState(['modelType', 'projectId']),
    ...mapState('content', ['targetFeature']),
    ...mapState('modeling', ['modeType', 'modelMethod'])
  },
  activated () {
    this.getModelDetail();
  },
  mounted () {
  },
  methods: {
    ...mapMutations('modeling', ['setModelDetail']),
    async getModelDetail () {
      this.detailInfor = null;
      this.list = [];
      let params = {
        project_id: this.projectId
      };
      let res = await get('getModelDetail', params);
      if (res.code === 0) {
        console.log(res);
        this.detailInfor = res;
        this.list = res.feature_list;
        this.setModelDetail(res);
      }
    },
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
    setPartitionMethod (item) {
      if (item === 'RANDOM') {
        return '随机抽样';
      } else if (item === 'STRATIFY') {
        return '分层抽样';
      } else if (item === 'NUMERICAL') {
        return '数值切割';
      } else if (item === 'TIME') {
        return '时间切割';
      }
    },
    infoClick () {
      this.infoFlag = true;
    },
    hideHandler () {
      this.infoFlag = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.confirm-infor{
  padding: 8px 0px;
  color: #fff;
  font-size: 14px;
  height: calc(100% - 170px);
  position: relative;
  .title {
    line-height: 32px;
    position: relative;
    &::before {
      content: '';
      height: 1px;
      width: 26px;
      background: #F6B421;
      position: absolute;
      left: 0px;
      bottom: 0px;
    }
  }
  .tips {
    color: #A4A4A4;
    font-size: 12px;
    line-height: 24px;
    padding: 8px 0px;
  }
  .content {
    margin-left: 12px;
    .list {
      min-height: 40px;
      display: flex;
      align-items: center;
      margin-top: 8px;
      >span {
        display: inline-block;
        min-height: 40px;
      }
      >span:first-child {
        width: 120px;
      }
      >span:nth-child(2) {
        width: 400px;
        line-height: 40px;
        border-bottom: 1px solid #424242;
        >span{
          color: #F6B421;
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
    .position-style {
      position: relative;
    }
  }
  .tips-box {
    position: absolute;
    top: 40px;
    left: 120px;
    .tip-panel {
      height: 366px;
      width: 320px;
      padding: 8px 8px;
      border-radius: 4px;
      color: #fff;
      font-size: 12px;
      background: #333;
      position: relative;
      overflow-y: auto;
      @include scrollBar(#a4a4a4, 5px);
      z-index: 1;
      .top-icon {
        position: absolute;
        left: 12px;
        top: -4px;
        width: 8px;
        height: 8px;
        background: #333;
        border-right: 1px solid #333;
        border-left: 1px solid #333;
        transform: rotate(-45deg);
      }
    }
    .infor-list {
      line-height: 32px;
    }
  }
}
</style>
