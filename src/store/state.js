const state = {
  userInfo: {
    user_name: '',
    company_name: '',
    role: 'Trial User'
  },
  projectName: '', // 项目名字
  projectId: '', // 项目ID
  projectStatus: '', // 项目状态
  hasFileList: [], // 项目文件列表
  isLoading: false,
  locale: 'zh',
  productInfo: {},
  currentIndex: 0,
  modelType: '',
  oldProjectList: {},
  formatSettingList: {}
};

export default state;
