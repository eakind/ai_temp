export const api = {

  userInfo: '/user/info/', // 获取个人信息
  productInfo: '/user/product/',

  // 项目列表
  projectList: '/project/my/', // 项目列表
  projectDetail: '/project/detail/', // 项目详情
  renameProject: '/project/rename/', // 修改项目名称
  delProject: '/project/delete/', // 删除项目
  projectLog: '/project/log/', // 项目日志
  myFiles: '/files/my/', // 获取项目列表

  // 新建项目
  postUploadFile: '/project/upload-file/', // post上传单个本地文件
  getUploadFile: '/project/upload-file/', // 获取已上传的文件
  delFile: '/project/delete-file/', // 删除上传的文件
  updateModelType: '/project/model_type/', // 模型数据 更新项目模型类型
  getFormatSetting: '/project/settings/', // get获取文件格式设置
  setFormatSetting: '/project/settings/', // post文件格式设置
  projectApply: '/project/apply/', // 创建项目->模型数据->套用旧项目
  applyDelete: '/project/apply/delete/', // 放弃套用旧项目
  createProject: '/project/create/', // 创建新项目
  completeUpload: '/project/complete-upload/', // 添加文件完成
  getTableData: '/project/data-table/', // 创建项目的表格数据
  getPreviewData: '/project/preview/', // 创建项目的表格预览数据
  addFile: '/project/add-file/', // 创建项目-使用历史文件
  applyList: '/project/apply/list/', // 创建项目-模型数据-可套用项目列表
  changeProcess: '/ai/project/process/change/', // webSocket
  projectFileList: 'project/file-list/', // 获取项目已有文件

  // 特征工程
  featureList: '/feature/list/', // 特征列表
  legalTargetList: '/feature/legal-target/list/', // 项目可选的taget特征列表
  postTargetModel: '/model/target/', // 修改目标特征
  getTargetModel: '/model/target/', // get获取目标特征
  distribution: '/feature/distribution/', // 获取特征分布
  featureDetail: '/feature/detail/', // 获取特征详情
  postMetricModel: '/model/metric/', // 修改目标特征评判标准
  featureHidden: '/feature/hidden/', // 特征显示、隐藏
  modifyFeature: '/feature/modify/', // 特征修改
  featureCreate: '/feature/create/', // 创建新特征

  dataTable: '/project/data-table/', // 预览数据

  // 分箱操作
  binningFeatures: '/feature/binning/features/', // 分箱特征列表
  binningAuto: '/feature/binning/auto/', // 执行分箱操作
  binningString: '/feature/binning/string/', // 字符型分箱结果
  binningNumerical: '/feature/binning/numerical/', // 数值型分箱结果
  postBinningNumerical: '/feature/binning/numerical/', // int型分箱调整
  postBinningString: '/feature/binning/string/', // string型分箱调整
  binningCancel: '/feature/binning/cancel/', // 放弃分箱调整
  binningStrValues: '/feature/binning/features/string_values/', // string型分箱分箱列值

  // 建模配置
  selectedAll: '/feature/selected/all/', // 修改自定义特征列表（全选）
  selectFeaList: '/feature/selected-list/', // 建模配置->选择特征->保存所选特征列表
  selectFea: '/feature/selected/', // post 单个选择特征
  modelTrain: '/model/train/', // post 开始训练
  scorecardTrain: '/model/scorecard_preprocess/', // post 评分卡模型开始训练
  getModelPattrns: '/model/patterns/', // 建模配置->选择模式->获取建模模式
  postModelPattrns: '/model/patterns/', // 建模配置->选择模式->保存/修改建模模式
  getModelCutData: '/model/cut_data/', // 建模配置->数据切割集->获取数据切割
  postModelCutData: '/model/cut_data/', // 建模配置->数据切割集->保存数据切割
  modelList: '/model/list/', // 获取模型列表
  getModelOptions: '/model/options/', // 建模配置->模型调参->获取模型参数
  postModelOptions: '/model/options/', // 建模配置->模型调参->模型参数修改
  getModelDetail: '/model/detail/', // 建模配置->确认信息->获取建模详情
  getModelLearnMethod: '/model/learn_method/', // 建模配置->学习方式->获取学习方式
  postModelLearnMethod: '/model/learn_method/', // 建模配置->学习方式->保存学习方式

  // 模型结果
  getMetricModel: '/model/metric/', // 获取评判标准
  modelScoreList: '/model/score/list/', // 获取模型评分列表
  modelTrainCv: '/model/train-cv/', // post 提交cv任务
  predictHoldout: '/model/predict-holdout/', // post 解除全部隔离
  auc: '/model/auc/', // get 模型比较中是数据,也在roc中调用
  liftChart: '/model/lift-chart/', // get 获取准确度
  importance: '/model/importance/', // get 影响因子
  gainChart: '/model/gain-chart/', // get GINI
  roc: '/model/roc/', // get roc
  ks: '/model/ks/', // get ks
  scorePerformance: '/model/model-score-performance/', // get 分数映射
  postScorePerformance: '/model/model-score-performance/', // post 分数映射设置
  strongAccuracy: '/model/strong-accuracy/', // get roc
  confusionMatrix: '/model/confusion-matrix/', // post roc 更改阀值选择
  xray: '/model/xray/', // get 模型剖析
  xrayStatus: '/model/xray/status/', // get 模型剖析状态
  dataset: '/model/predict/dataset/', // get 下载预测数据
  predictFile: '/model/predict/file/', // post 上传预测文件
  predictDown: '/model/predict/download/', // get 下载新预测数据
  deleteJob: '/project/job/delete/', // post 删除建模任务
  taskRemove: '/task/revoke/', // post 删除任务
  taskList: '/task/list/', // get 任务列表
  modelSummary: '/model/model-summary/', // get 模型汇总
  verifyResult: '/model/verify-result/', // get 分析汇总
  psiFeatureList: '/model/scorecard/psi/feature/list/', // get 评分卡模型psi特征列表
  psi: '/model/scorecard/psi/', // get 评分卡模型psi
  psiStatus: '/model/psi/status/', // get psi状态
  clusteringPie: '/model/clustering/pie/', // get 获取聚类饼图
  clustering2d: '/model/clustering/2d/', // 获取聚类图
  clusteringXray: '/model/clustering/xray/', // 获取聚类特征剖析
  clusteringCentroid: '/model/clustering/centroid/', // 聚类图分组中心点
  clusteringScore: '/model/clustering/score/' // 聚类图模型评分列表

};
