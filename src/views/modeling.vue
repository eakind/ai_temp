<template>
  <div class="modeling">
    <div class="modeling-header">
      <span>建模配置</span>
      <span @click="returnBack">返回数据</span>
    </div>
    <create-step :select="curIndex" type="modeling" :stepList="modelingStepList" :showIcon="true" :stepSelcted="stepSelcted" @next="nextHandler" @pre="preHandler" @create="createHandler" @modeling="modelingHandler"></create-step>
    <div class="bottom-box">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <component :is="modelingPageList[curIndex]"></component>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>
<script>
import CreateStep from '@/components/createStep/index.vue';
import SelectFeature from './modeling/selectFeature.vue';
import SelectMode from './modeling/selectMode.vue';
import LearnMethod from './modeling/learnMethod.vue';
import ConfirmInfor from './modeling/confirmInfor.vue';
import SplitDatasets from './modeling/splitDatasets.vue';
import AdjustParams from './modeling/adjustParams.vue';
import { mapState, mapMutations } from 'vuex';
import { post } from '@/api/server';
import { createWs } from '@/mixins/createWs.js';
export default {
  data () {
    return {
      curIndex: 0,
      // stepList: ['选择特征', '选择模式', '具体配置', '学习方式', '确认信息'],
      stepList: ['选择特征', '选择模式', '学习方式', '确认信息'],
      stepSelcted: [true, false, false, false],
      waitList: [],
      activeList: []
    };
  },
  components: {
    CreateStep,
    SelectFeature,
    SelectMode,
    LearnMethod,
    ConfirmInfor,
    SplitDatasets,
    AdjustParams
  },
  mixins: [createWs],
  beforeDestroy () {
    this.setCurrentIndex(0);
  },
  // watch: {
  //   modeType (val) {
  //     console.log(val);
  //     if (val === 'manual') {
  //       this.setModelingPageList(['select-feature', 'select-mode', 'split-datasets', 'adjust-params', 'learn-method', 'confirm-infor']);
  //       this.setModelingStepList(['选择特征', '选择模式', '数据切割', '模型调参', '学习方式', '确认信息']);
  //     } else {
  //       this.setModelingPageList(['select-feature', 'select-mode', 'learn-method', 'confirm-infor']);
  //       this.setModelingStepList(['选择特征', '选择模式', '学习方式', '确认信息']);
  //     }
  //   }
  // },
  computed: {
    ...mapState('status', ['modelDesc']),
    ...mapState(['currentIndex', 'projectId', 'modelType']),
    ...mapState('modeling', ['modelingStepList', 'stepName', 'modeType', 'modelMethod', 'modelingPageList', 'modifyOptionsParam', 'modelDetail'])
  },
  created () {
    this.curIndex = this.currentIndex;
    if (this.modeType === 'manual' && this.currentIndex > 1) {
      this.setModelingPageList(['select-feature', 'select-mode', 'split-datasets', 'adjust-params', 'learn-method', 'confirm-infor']);
      this.setModelingStepList(['选择特征', '选择模式', '数据切割', '模型调参', '学习方式', '确认信息']);
    } else if (this.modeType === 'auto' && this.currentIndex > 1) {
      this.setModelingPageList(['select-feature', 'select-mode', 'learn-method', 'confirm-infor']);
      this.setModelingStepList(['选择特征', '选择模式', '学习方式', '确认信息']);
    } else {
      this.setModelingStepList(['选择特征', '选择模式', '具体配置', '学习方式', '确认信息']);
    }
    this.setStepName(this.modelingStepList[this.currentIndex]);
  },
  methods: {
    ...mapMutations('modeling', ['setModelingStepList', 'setStepName', 'setModelingPageList']),
    ...mapMutations(['setCurrentIndex', 'setProjectStatus']),
    nextHandler () {
      if (this.modelingStepList[this.currentIndex] === '模型调参') {
        if (JSON.stringify(this.modifyOptionsParam.select_model_data) === '{}') {
          this.$message({
            message: '请选择模型',
            type: 'warning'
          });
          return false;
        }
        this.postModelOptions();
      }
      this.curIndex++;
      this.setCurrentIndex(this.curIndex);
      if (this.currentIndex === 2 && this.modeType === 'auto') {
        this.setModelingPageList(['select-feature', 'select-mode', 'learn-method', 'confirm-infor']);
        this.setModelingStepList(['选择特征', '选择模式', '学习方式', '确认信息']);
      } else if (this.currentIndex === 2 && this.modeType === 'manual') {
        this.setModelingPageList(['select-feature', 'select-mode', 'split-datasets', 'adjust-params', 'learn-method', 'confirm-infor']);
        this.setModelingStepList(['选择特征', '选择模式', '数据切割', '模型调参', '学习方式', '确认信息']);
      }
      this.setStepName(this.modelingStepList[this.currentIndex]);
    },
    async postModelOptions () {
      let res = await post('postModelOptions', this.modifyOptionsParam);
      if (res.code !== 0) {
        return false;
      }
    },
    preHandler () {
      this.curIndex--;
      this.setCurrentIndex(this.curIndex);
      // if (this.currentIndex === 1 && this.modeType === 'auto') {
      //   this.setModelingStepList(['选择特征', '选择模式', '具体配置', '学习方式', '确认信息']);
      //   this.setModelingPageList(['select-feature', 'select-mode', 'learn-method', 'confirm-infor']);
      //   this.setModelingStepList(this.modelingStepList);
      //   this.setCurrentIndex(this.curIndex);
      // } else if (this.currentIndex === 1 && this.modeType === 'manual') {
      //   this.setModelingStepList(['选择特征', '选择模式', '数据切割', '模型调参', '学习方式', '确认信息']);
      //   this.setModelingPageList(['select-feature', 'select-mode', 'split-datasets', 'adjust-params', 'learn-method', 'confirm-infor']);
      //   this.setModelingStepList(this.modelingStepList);
      //   this.setCurrentIndex(this.curIndex);
      // }
      if (this.currentIndex === 1) {
        this.setModelingStepList(['选择特征', '选择模式', '具体配置', '学习方式', '确认信息']);
        this.setModelingPageList(['select-feature', 'select-mode', 'learn-method', 'confirm-infor']);
        this.setModelingStepList(this.modelingStepList);
        this.setCurrentIndex(this.curIndex);
      }
      this.setStepName(this.modelingStepList[this.currentIndex]);
      // console.log(this.stepName);
      // if (this.stepName === '选择模式') {
      //   this.modelingStepList.splice(1, 0, '具体配置');
      // }
      // this.setCurrentIndex(this.curIndex);
    },
    createHandler () {},
    async modelingHandler () {
      if (this.modeType === 'manual' && !this.modelDetail.holdout_percent && !this.modelDetail.validation_percent) {
        this.$message({
          message: '未进行切割数据集操作',
          type: 'warning'
        });
        return;
      }
      let params = {
        project_id: this.projectId,
        modeling_method: this.modelMethod
      };
      this.createWs();
      let res;
      if (this.modelType === 'SCORECARD') {
        res = await post('scorecardTrain', params);
      } else {
        res = await post('modelTrain', params);
      }
      if (res.code === 0) {
        this.createWs();
        this.setProjectStatus('PROCESSING');
        this.$router.push({ path: '/content/building' });
      }
    },
    returnBack () {
      this.$router.go(-1);
    },
    createWs () {
      let jobType = {
        analysis: '数据分析',
        dist: '重新计算分布',
        preprocess: '数据预处理',
        train: '训练',
        cv: 'traincv',
        holdout: '解锁隔离集',
        xray: '模型剖析'
      };
      this.initWs();
      window.ws.onmessage = (event) => {
        console.log(JSON.parse(event.data));
        if (!event.data) return;
        let data = JSON.parse(event.data);
        let waitObj = null;
        let activeObj = null;
        switch (data.msg_type) {
          case 'active_created':
            activeObj = {
              name: `I ${this.modelDesc[data.job_title] ? this.modelDesc[data.job_title] : ''} (data${data.job_subtitle ? data.job_subtitle : ''})`,
              jobId: data.job_id,
              type: jobType[data.job_type]
            };
            if (!this.unique(this.activeList, data.job_id)) {
              this.activeList.push(activeObj);
              let len = this.waitList.length;
              for (let i = 0; i < len; i++) {
                if (!this.waitList[i]) continue;
                if (this.waitList[i].jobId === activeObj.jobId) {
                  this.waitList.splice(i, 1);
                  break;
                }
              }
            }
            break;
          case 'waiting_created':
            waitObj = {
              name: `I ${this.modelDesc[data.job_title] ? this.modelDesc[data.job_title] : ''} (data${data.job_subtitle ? data.job_subtitle : ''})`,
              jobId: data.job_id,
              type: jobType[data.job_type]
            };
            if (!this.unique(this.waitList, data.job_id)) {
              this.waitList.push(waitObj);
            }
            break;
          case 'active_done':
            for (let i = 0, len = this.waitList.length; i < len; i++) {
              if (!this.waitList[i]) continue;
              if (data.job_id === this.waitList[i].jobId) {
                this.waitList.splice(i, 1);
                break;
              }
            }
            for (let i = 0, len = this.activeList.length; i < len; i++) {
              if (!this.activeList[i]) continue;
              if (data.job_id === this.activeList[i].jobId) {
                this.activeList.splice(i, 1);
                break;
              }
            }
            this.bus.$emit('refreshModelList');
            break;
        }
      };
    },
    unique (arr, jobId) {
      let len = arr.length;
      for (let i = 0; i < len; i++) {
        if (arr[i].jobId === jobId) {
          return true;
        }
      }
      return false;
    }
  }
};
</script>
<style lang='scss' scoped>
.modeling {
  width: calc(100% - 160px) !important;
  background: #2b2b2b;
  color: #fff;
  font-size: 12px;
  padding: 8px 80px;
  .modeling-header {
    width: 100%;
    padding-right: 32px;
    display: flex;
    justify-content: space-between;
    >span:nth-child(1) {
      color: #FCF8DF;
      font-size: 16px;
      font-weight: bold;
      display: inline-block;
      line-height: 40px;
      border-bottom: 1px solid #F6B421;
    }
    >span:nth-child(2) {
      display: inline-block;
      width: 80px;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
      color: #A4A4A4;
      cursor: pointer;
    }
  }
  .bottom-box {
    border-top: 1px solid #424242;
    margin-top: 16px;
    height: 100%;
  }
}
</style>
