const state = {
  modelDesc: {
    '': '',
    LINEAR_REG_L1_L2: 'Linear Regressor (L1/L2)',
    ELASTIC_REG_L1_L2: 'ElasticNet(L1/L2)',
    ELASTIC_REG_L1: 'ElasticNet(L1)',
    ELASTIC_REG_L2: 'ElasticNet(L2)',
    SGD_REG: 'SGD',
    GLM_GAMMA: 'GLM(Gamma)',
    GLM_POISSON: 'GLM(Poisson)',
    GLM_TWEEDIE: 'GLM(Tweedie)',
    XGB_POISSON: 'Xgboost(Poisson)',
    XGB_GAMMA: 'Xgboost(Gamma)',
    XGB_TWEEDIE: 'Xgboost(Tweedie)',
    XGB_POISSON_EARLY: 'Xgboost(Poisson, early)',
    XGB_GAMMA_EARLY: 'Xgboost(Gamma, early)',
    XGB_TWEEDIE_EARLY: 'Xgboost(Tweedie, early)',
    XGB_LINEAR_EARLY: 'Xgboost(linear, early)',
    DTREE_MSE: 'Decision Tree',
    RF_MSE: 'Random Forest',
    ETREES_MSE: 'Extra Trees',
    KNN_REG: 'KNN(minkowski distance',
    TENSORFLOW_REG: 'Tensorflow(CPU)',
    GBM_CLS: 'LightGBM',
    LOGISTIC_REG: 'Logistic Regression',
    LOGISTIC_REG_L2: 'Logistic Regression',
    GAM: 'GAM',
    ELASTIC_CLS_L1_L2: 'ElasticNet (L1/L2)',
    ELASTIC_CLS_L1: 'ElasticNet (L1)',
    ELASTIC_CLS_L2: 'ElasticNet (L2)',
    SGD_CLS: 'SGD',
    SVM_CLS: 'SVM',
    XGB_CLS: 'Xgboost',
    DTREE_ENTROPY: 'Decision Tree(Entropy)',
    DTREE_GINI: 'Decision Tree(Gini)',
    RF_ENTROPY: 'Random Forest(Entropy)',
    RF_GINI: 'Random Forest(Gini)',
    ETREES_ENTROPY: 'Extra Trees(Entropy)',
    ETREES_GINI: 'Extra Trees(Gini)',
    BAYES_BERNOULLI: 'Naïve Bayes(Bernoulli)',
    BAYES_GAUSSIAN: 'Naïve Bayes(Gaussian)',
    BAYES_MULTINOMIAL: 'Naïve Bayes(Multinomial)',
    KNN_CLS: 'KNN(minkowski distance)',
    TENSORFLOW_CLS: 'Tensorflow',
    distribution: 'distribution',
    SCORECARD: 'Scorecard',
    AHC: 'AHC',
    KMEANS: 'K-means',
    DBSCAN: 'DBSCAN'
  } // 模型描述
};
const mutations = {
};

export default {
  namespaced: true,
  state,
  mutations
};
