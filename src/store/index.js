import Vue from 'vue';
import Vuex from 'vuex';
import Persistedstate from 'vuex-persistedstate';
import content from './modules/content.js';
import modeling from './modules/modeling.js';
import status from './modules/status.js';
import result from './modules/result.js';
import state from './state';
import mutations from './mutations';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    content,
    modeling,
    status,
    result
  },
  state,
  mutations,
  plugins: [new Persistedstate({
    storage: window.sessionStorage,
    reducer (state) {
      return {
        projectId: state.projectId,
        projectName: state.projectName,
        projectStatus: state.projectStatus,
        currentIndex: state.currentIndex,
        hasFileList: state.hasFileList,
        modelType: state.modelType,
        oldProjectList: state.oldProjectList,
        formatSettingList: state.formatSettingList,
        content: {
          selectedFeature: state.content.selectedFeature,
          targetFeature: state.content.targetFeature,
          metricsList: state.content.metricsList,
          metricsSelect: state.content.metricsSelect
        },
        modeling: {
          modelingStepList: state.modeling.modelingStepList,
          stepName: state.modeling.stepName,
          modeType: state.modeling.modeType,
          modelMethod: state.modeling.modelMethod,
          modelingPageList: state.modeling.modelingPageList,
          partitionMethod: state.modeling.partitionMethod,
          cutDataType: state.modeling.cutDataType
        },
        result: {
          waitList: state.result.waitList,
          activeList: state.result.activeList,
          modelScoreParam: state.result.modelScoreParam,
          outputItem: state.result.outputItem,
          selectMenu: state.result.selectMenu
        }
      };
    }
  })] // 数据持久化
});
