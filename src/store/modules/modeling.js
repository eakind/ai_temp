const state = {
  modelingStepList: null,
  modelingPageList: ['select-feature', 'select-mode', 'learn-method', 'confirm-infor'],
  stepName: null,
  modeType: null, // 建模模式
  modelMethod: '', // 学习模式
  partitionMethod: null, // 数据切割方式
  modifyOptionsParam: {},
  cutDataType: 'normal',
  modelDetail: null
};
const mutations = {
  setModelingStepList (state, array) {
    state.modelingStepList = array;
  },
  setModelingPageList (state, array) {
    state.modelingPageList = array;
  },
  setStepName (state, str) {
    state.stepName = str;
  },
  setModeType (state, str) {
    state.modeType = str;
  },
  setModelMethod (state, str) {
    state.modelMethod = str;
  },
  setPartitionMethod (state, str) {
    state.partitionMethod = str;
  },
  setModifyOptionsParam (state, obj) {
    state.modifyOptionsParam = obj;
  },
  setCutDataType (state, str) {
    state.cutDataType = str;
  },
  setModelDetail (state, obj) {
    state.modelDetail = obj;
  }
};
export default {
  namespaced: true,
  state,
  mutations
};
