const state = {
  waitList: [],
  activeList: [],
  modelScoreParam: null,
  outputItem: null, // 选择模型输出
  selectMenu: 'accuracy', // 模型结果评价菜单选择
  matrixObj: {
    tLeft: '',
    tRight: '',
    bLeft: '',
    bRight: ''
  }, // 矩阵数据
  labelList: [], // 聚类图分组数
  clusterFea: {}, // 当前选中的聚类特征
  selectLabel: {}, // 当前选中的标签
  xrayObj: {}, // 特征xray对象数据
  totalCluster: 0 // 聚合总分类数
};
const mutations = {
  setWaitList (state, arr) {
    state.waitList = arr;
  },
  setActiveList (state, arr) {
    state.activeList = arr;
  },
  setModelScoreParam (state, obj) {
    state.modelScoreParam = obj;
  },
  setOutputItem (state, obj) {
    state.outputItem = obj;
  },
  setSelectMenu (state, str) {
    state.selectMenu = str;
  },
  setMatrixObj (state, obj) {
    state.matrixObj = obj;
  },
  setLabelList (state, list) {
    state.labelList = list;
  },
  setClusterFea (state, object) {
    state.clusterFea = object;
  },
  setSelectLabel (state, string) {
    state.selectLabel = string;
  },
  setXrayObj (state, obj) {
    state.xrayObj = obj;
  },
  setTotalCluster (state, num) {
    state.totalCluster = num;
  }
};
export default {
  namespaced: true,
  state,
  mutations
};
