<template>
  <div class="content-view">
    <div class="model-btn">{{ setModelName(modelType) }}</div>
    <div class="tab-box">
      <el-tabs v-model="selectName">
        <el-tab-pane label="设置目标" name="setTarget" v-if="modelType !== 'CLUSTERING'">
        </el-tab-pane>
        <el-tab-pane label="特征工程" name="featureContent">
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="btn-box" @click="modelingHandler">
      <div class="create-btn">
        <span class="iconfont icon-db10_logoAi"></span>
        开始建模
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <component :is="selectName"></component>
    </transition>
  </div>
</template>
<script>
import SetTarget from './setTarget.vue';
import FeatureContent from './featureContent.vue';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      selectName: 'setTarget'
    };
  },
  components: {
    SetTarget,
    FeatureContent
  },
  computed: {
    ...mapState(['modelType'])
  },
  mounted () {
    if (this.modelType === 'CLUSTERING') {
      this.selectName = 'featureContent';
    } else {
      this.selectName = 'setTarget';
    }
  },
  methods: {
    modelingHandler () {
      this.$router.push({
        path: '/modeling'
      });
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
    }
  }
};
</script>
<style lang='scss' scoped>
.content-view {
  padding: 0px 128px 16px 24px;
  position: relative;
  .model-btn {
    height: 24px;
    line-height: 24px;
    width: 80px;
    text-align: center;
    border-radius: 0px 0px 4px 4px;
    font-size: 12px;
    color: #FCF8DF;
    margin-bottom: 24px;
    background: linear-gradient(-180deg, #F6B421 0%, #373122 22%, #373122 77%, #F6B421 100%);
  }
  .btn-box {
    position: absolute;
    right: 128px;
    top: 36px;
  }
  .create-btn {
    padding-left: 40px;
    height: 40px;
    line-height: 40px;
    width: 96px;
    text-align: center;
    border-radius: 20px 4px 4px 20px;
    background: linear-gradient(90deg, #444444 0%, #2e2e2e 100%);
    position: relative;
    cursor: pointer;
    .icon-db10_logoAi {
      height: 26px;
      line-height: 26px;
      width: 40px;
      border-radius: 7px;
      font-size: 20px;
      // background: rgba($color: #444444, $alpha: 0.6);
      position: absolute;
      left: 0px;
      top: 7px;
    }
    &::before {
      content: '';
      height: 40px;
      width: 40px;
      border-radius: 50%;
      position: absolute;
      // background: #F6B421;
      background: linear-gradient(180deg, #F6B421 0%, #483F2A 30%, #483F2A 80%, #F6B421 100%);
      left: 0;
    }
  }
}
</style>
<style lang='scss'>
.content-view {
  .el-tabs__nav-wrap {
    &::after {
      width: calc(100% - 160px);
    }
  }
}
</style>
