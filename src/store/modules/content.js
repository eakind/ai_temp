const state = {
  selectedFeature: null, // 已选特征
  targetFeature: null, // 目标特征
  targetData: [], // 目标特征图表数据
  selectedData: [], // 选择特征图表数据
  metricsList: [], // 目标特征下拉框列表
  metricsSelect: '', // 目标特征下拉选择
  binningAutoParams: {
    project_id: '',
    feature_idxs: [],
    binning_type: '',
    bound: '',
    is_fit_feature: null,
    n_bins: 2,
    strategy: null
  }, // 分箱操作参数
  selectedBinning: null // 已选中的分箱
};
const mutations = {
  setSelectedFeature (state, object) {
    state.selectedFeature = object;
  },
  setTargetFeature (state, object) {
    state.targetFeature = object;
  },
  setTargetData (state, array) {
    state.targetData = array;
  },
  setSelectedData (state, array) {
    state.selectedData = array;
  },
  setMetricsList (state, array) {
    state.metricsList = array;
  },
  setMetricsSelect (state, str) {
    state.metricsSelect = str;
  },
  setBinningAutoParams (state, object) {
    state.binningAutoParams = object;
  },
  setSelectedBinning (state, object) {
    state.selectedBinning = object;
  }
};
export default {
  namespaced: true,
  state,
  mutations
};
