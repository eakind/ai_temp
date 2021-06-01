const mutations = {
  setUserInfo (state, obj) {
    state.userInfo = obj;
  },
  setProjectName (state, str) {
    state.projectName = str;
  },
  setProjectId (state, str) {
    state.projectId = str;
  },
  setProjectStatus (state, str) {
    state.projectStatus = str;
  },
  setHasFileList (state, array) {
    state.hasFileList = array;
  },
  setSessionId (state, str) {
    state.sessionId = str;
  },
  setIsLoading (state, boolean) {
    state.isLoading = boolean;
  },
  setLocale (state, str) {
    state.locale = str;
  },
  setProductInfo (state, obj) {
    state.productInfo = obj;
  },
  setCurrentIndex (state, Number) {
    state.currentIndex = Number;
  },
  setModelType (state, str) {
    state.modelType = str;
  },
  setOldProjectList (state, obj) {
    state.oldProjectList = obj;
  },
  setFormatSettingList (state, obj) {
    state.formatSettingList = obj;
  }
};

export default mutations;
