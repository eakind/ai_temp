<template>
  <div class="result">
    <div class="header">
      <div class="model-name">
        {{setModelName(modelType)}}
        <span>选择对应指标查看结果</span>
      </div>
      <div class="model-type">专家可调模式（快速学习）</div>
      <div class="return-panel">
        <div class="return" @click="returnHandler">
          <span class="iconfont icon-db_arrow"></span>
          返回模型列表
        </div>
        <div class="btn-box" @click="outputHandler" v-click-out="outputHide">
          <div class="output-btn">
            <span class="iconfont icon-db_export"></span>
            输出预测
          </div>
          <select-data-source :datasourceFlag="datasourceFlag" @select="selectMethods"></select-data-source>
        </div>
      </div>
    </div>
    <div class="result-body">
      <div class="result-left">
        <div class="menu-item" v-for="(item, index) in menuList" :key="index"
          :class="selectMenu === item.code ? 'item-active' : ''" @click="selectMenuItem(item)">
          {{item.name}}
        </div>
      </div>
      <div class="result-right">
        <div class="right-header" v-if="isModel || isData || isGroup || isCheck || isExport || isDataSet">
          <div v-if="isModel">
            切换模型<drop-list :list="modelList" :select="outputItem.name" class="drop-model-list" @on-change="changeModel"></drop-list>
          </div>
          <div v-if="isData">
            数据集<drop-list :list="dataList" :select="selectData" class="drop-list" @on-change="changeData"></drop-list>
          </div>
          <div v-if="isGroup">
            分组数<drop-list :list="groupList" :select="selectGroup" class="drop-list" @on-change="changeGroup"></drop-list>
          </div>
          <div v-if="isClustering">
            <span  class="pre-title total-num">总分类数: {{totalCluster}}</span>
            <span  class="pre-title">显示前</span>
            <drop-list :list="groupList" :select="selectGroup" class="drop-list" @on-change="changeGroup"></drop-list>
            <span  class="pre-title">类</span>
          </div>
          <div v-if="isCheck">
            缺失值
            <el-switch class="switch" v-model="displayValue" active-color="#222222" inactive-color="#333333" @change="changeMissing"></el-switch>
            <span class="show-name">{{ displayValue ? '显示' : '隐藏'}}</span>
          </div>
          <div class="header-right" v-if="isExport">
            <div v-if="selectMenu==='roc'"  @click="isDownload='matrix'"><span class="iconfont icon-db_download"></span>导出混淆矩阵</div>
            <div @click="isDownload='data'"><span class="iconfont icon-db_download"></span>下载数据表</div>
            <div @click="isDownload='image'"><span class="iconfont icon-db_picbase"></span>保存图片</div>
          </div>
          <div v-if="isDataSet">
            <drop-list :list="dataSetList" select="训练集和测试集" class="psi-list" @on-change="changeDataSet"></drop-list>
          </div>
        </div>
        <div class="content">
          <model-gather v-if="selectMenu === 'gather'" :isDownload="isDownload"></model-gather>
          <test-result v-if="selectMenu === 'result'"></test-result>
          <accuracy v-if="selectMenu === 'accuracy'" :isDownload="isDownload" :dataSource="dataSource" :group="selectGroup" @setGroup="setAccurayGroup"></accuracy>
          <impact-factor :isDownload="isDownload" :group="selectGroup" @setGroup="setImpactGroup" v-if="selectMenu === 'factor'"></impact-factor>
          <gini v-if="selectMenu === 'gini'" :isDownload="isDownload" :group="selectGroup" :dataSource="dataSource"></gini>
          <roc v-if="selectMenu === 'roc'" :dataSource="dataSource" :isDownload="isDownload"></roc>
          <ks v-if="selectMenu === 'ks'" :isDownload="isDownload" :dataSource="dataSource"></ks>
          <psi v-if="selectMenu === 'psi'" :isDownload="isDownload" :group="selectGroup" :dataSet="dataSet" :showMissing="showMissing"></psi>
          <model-analysis v-if="selectMenu === 'analysis'" :isDownload="isDownload" :dataSource="dataSource" :group="selectGroup" :showMissing="showMissing"
            @setGroup="setAccurayGroup" @setGroupCat="setImpactGroup" @changeIndex="changeFea"></model-analysis>
          <model-comparsion v-if="selectMenu === 'comparsion'" :modelList="modelList" :isDownload="isDownload"></model-comparsion>
          <clustering-chart v-if="selectMenu === 'clusteringChart'" :group="selectGroup" :isDownload="isDownload"></clustering-chart>
          <clustering-pie v-if="selectMenu === 'clusteringPie'" :isDownload="isDownload"></clustering-pie>
        </div>
      </div>
    </div>
    <output-prediction :outputFlag="outputFlag" v-if="outputFlag" :selectIndex="selectIndex" :modelList="modelList" @confirm="outputConfirm" @cancel="outputCancel"></output-prediction>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import DropList from '@/components/dropList/index.vue';
import ModelGather from './result/modelGather.vue';
import TestResult from './result/testResult.vue';
import Accuracy from './result/accuracy.vue';
import ImpactFactor from './result/impactFactor.vue';
import Gini from './result/gini.vue';
import Roc from './result/roc.vue';
import Ks from './result/ks.vue';
import Psi from './result/psi.vue';
import ModelAnalysis from './result/modelAnalysis.vue';
import ModelComparsion from './result/modelComparsion.vue';
import SelectDataSource from './result/outputPrediction/selectDataSource.vue';
import OutputPrediction from './result/outputPrediction/outputPrediction.vue';
import ClusteringChart from './result/clusteringChart.vue';
import ClusteringPie from './result/clusteringPie.vue';
import { get } from '@/api/server';
export default {
  data () {
    return {
      datasourceFlag: false,
      outputFlag: false,
      selectIndex: -1,
      menuList: [{
        name: '模型汇总',
        code: 'gather'
      }, {
        name: '检验结果',
        code: 'result'
      }, {
        name: '提升曲线',
        code: 'accuracy'
      }, {
        name: '影响因子',
        code: 'factor'
      }, {
        name: 'ROC',
        code: 'roc'
      }, {
        name: '模型剖析',
        code: 'analysis'
      }, {
        name: '模型比较',
        code: 'comparsion'
      }],
      modelList: [],
      dataList: [],
      dataSetList: [{
        name: '训练集和测试集',
        value: 'tv'
      }, {
        name: '训练集和隔离集',
        value: 'th'
      }],
      selectData: '训练集',
      dataSource: 'VALIDATE',
      dataSet: 'tv',
      groupList: [],
      selectGroup: 0,
      isDownload: '',
      displayValue: false,
      showMissing: false
    };
  },
  components: {
    DropList,
    ModelGather,
    TestResult,
    Accuracy,
    ImpactFactor,
    Gini,
    Roc,
    Ks,
    Psi,
    ModelAnalysis,
    ModelComparsion,
    SelectDataSource,
    OutputPrediction,
    ClusteringChart,
    ClusteringPie
  },
  computed: {
    ...mapState(['modelType']),
    ...mapState('result', ['selectMenu', 'modelScoreParam', 'outputItem', 'totalCluster']),
    ...mapState('status', ['modelDesc']),
    isModel () {
      let obj = {
        gather: true,
        residual: true,
        result: true,
        accuracy: true,
        factor: true,
        roc: true,
        ks: true,
        psi: true,
        gini: true,
        analysis: true,
        comparsion: false,
        prediction: true,
        clusteringChart: true,
        clusteringPie: true
      };
      return obj[this.selectMenu];
    },
    isData () {
      let obj = {
        gather: false,
        residual: false,
        accuracy: true,
        factor: false,
        roc: true,
        ks: true,
        gini: false,
        analysis: false,
        comparsion: false,
        prediction: false
      };
      return obj[this.selectMenu];
    },
    isGroup () {
      let obj = {
        gather: false,
        residual: false,
        accuracy: true,
        factor: true,
        roc: false,
        ks: false,
        psi: true,
        gini: true,
        analysis: true,
        comparsion: false
      };
      return obj[this.selectMenu];
    },
    isCheck () {
      let obj = {
        gather: false,
        residual: false,
        accuracy: false,
        factor: false,
        roc: false,
        ks: false,
        psi: true,
        gini: false,
        analysis: true,
        comparsion: false,
        prediction: false
      };
      return obj[this.selectMenu];
    },
    isExport () {
      let obj = {
        gather: true,
        residual: true,
        accuracy: true,
        factor: true,
        roc: true,
        ks: true,
        psi: true,
        gini: true,
        analysis: false,
        comparsion: true,
        clusteringChart: true,
        clusteringPie: true
      };
      return obj[this.selectMenu];
    },
    isDataSet () {
      let obj = {
        gather: false,
        residual: false,
        accuracy: false,
        factor: false,
        roc: false,
        ks: false,
        psi: true,
        gini: false,
        analysis: false,
        comparsion: false,
        clusteringChart: false,
        clusteringPie: false
      };
      return obj[this.selectMenu];
    },
    isClustering () {
      let obj = {
        clusteringChart: true
      };
      return obj[this.selectMenu];
    }
  },
  watch: {
    outputItem: {
      handler (item) {
        if (this.selectMenu === 'clusteringChart') {
          if (this.groupList.length) {
            this.selectGroup = 5;
          } else {
            this.selectGroup = 0;
          }
        } else {
          this.selectGroup = 0;
        }
        this.setDataList();
      },
      deep: true,
      immediate: true
    },
    totalCluster: {
      handler (len) {
        if (this.selectMenu === 'clusteringChart') {
          let all = {
            name: '全部',
            value: '全部'
          };
          this.groupList = [];
          this.selectGroup = 5;
          if (len > 5 && len < 10) this.groupList = [{ name: 5, value: 5 }];
          if (len >= 10 && len <= 20) this.groupList = [{ name: 5, value: 5 }, { name: 10, value: 10 }];
          if (len > 20) this.groupList = [{ name: 5, value: 5 }, { name: 10, value: 10 }, { name: 20, value: 20 }];
          this.groupList.push(all);
        }
      },
      deep: true
    },
    selectMenu: {
      handler (val) {
        if (val === 'psi') {
          this.groupList = [{ name: 10, value: 10 }, { name: 20, value: 20 }];
          this.selectGroup = 20;
        }
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    // this.setModelType('REGRESSION');
    // this.setModelType('GLM_REGRESSION');
    this.modelScoreList();
    this.initMenu();
  },
  methods: {
    ...mapMutations(['setModelType']),
    ...mapMutations('result', ['setSelectMenu', 'setOutputItem']),
    initMenu () {
      if (this.modelType === 'SCORECARD') {
        this.menuList.splice(0, 5);
        let arr = [{
          name: '模型汇总',
          code: 'gather'
        }, {
          name: '提升曲线',
          code: 'accuracy'
        }, {
          name: 'ROC',
          code: 'roc'
        }, {
          name: 'KS',
          code: 'ks'
        }, {
          name: 'PSI',
          code: 'psi'
        }, {
          name: '影响因子',
          code: 'factor'
        }];
        this.menuList = arr.concat(this.menuList);
        this.setSelectMenu('gather');
      } else if (this.modelType === 'BINARY_CLASS') {
        this.menuList.splice(0, 2);
        this.setSelectMenu('accuracy');
      } else if (this.modelType === 'REGRESSION') {
        this.menuList.splice(0, 2);
        let obj = {
          name: 'GINI',
          code: 'gini'
        };
        this.menuList.splice(2, 1, obj);
        this.setSelectMenu('accuracy');
      } else if (this.modelType === 'GLM_REGRESSION') {
        this.menuList.splice(1, 1, { name: '残差检验', code: 'residual' });
        this.menuList.splice(3, 1);
        this.menuList.splice(3, 1, { name: 'GINI', code: 'gini' });
        this.setSelectMenu('gather');
      } else if (this.modelType === 'CLUSTERING') {
        this.menuList = [{
          name: '聚类图',
          code: 'clusteringChart'
        }, {
          name: '聚类结果分布饼图',
          code: 'clusteringPie'
        }];
        this.setSelectMenu('clusteringChart');
      }
    },
    selectMenuItem (item) {
      this.setSelectMenu(item.code);
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
    },
    outputHandler () {
      this.datasourceFlag = true;
    },
    outputHide () {
      this.datasourceFlag = false;
    },
    setDataList () {
      if (this.outputItem.holdout_status === 'SUCCEED') {
        this.dataList = [{
          name: '隔离集',
          value: 'HOLDOUT'
        }, {
          name: '测试集',
          value: 'VALIDATE'
        }];
      } else {
        this.dataList = [{
          name: '测试集',
          value: 'VALIDATE'
        }];
      }
      this.selectData = this.dataList[0].name;
      this.dataSource = this.dataList[0].value;
    },
    async modelScoreList () {
      let res = await get('modelScoreList', this.modelScoreParam);
      if (res.code === 0) {
        for (let i in res.model_list) {
          this.modelList.push({
            name: `${this.modelDesc[res.model_list[i].model_id]} (data${res.model_list[i].sampling})`,
            value: res.model_list[i].model_id,
            ...res.model_list[i]
          });
        }
      }
    },
    changeModel (item) {
      let obj = JSON.parse(JSON.stringify(item));
      obj.name = `${this.modelDesc[item.model_id]} (data${item.sampling})`;
      obj.value = item.model_id;
      obj.modelType = this.modelType;
      this.setOutputItem(obj);
    },
    changeData (item) {
      this.selectData = item.name;
      this.dataSource = item.value;
    },
    changeDataSet (item) {
      this.dataSet = item.value;
    },
    changeGroup (item) {
      this.selectGroup = item.value;
    },
    changeMissing (val) {
      this.showMissing = val;
    },
    setAccurayGroup (len) {
      this.groupList = [];
      this.selectGroup = 0;
      if (len < 15) {
        this.groupList.push({
          name: len,
          value: len
        });
      } else {
        let arr = [3, 4, 6, 15];
        for (let i of arr) {
          this.groupList.push({
            name: Math.floor(len / i),
            value: Math.floor(len / i)
          });
        }
      }
      setTimeout(() => {
        if (this.groupList.length > 2) {
          this.selectGroup = this.groupList[1].value;
        } else {
          this.selectGroup = this.groupList[0].value;
        }
      });
    },
    setImpactGroup (len) {
      this.groupList = [];
      this.selectGroup = 0;
      if (len < 10) {
        this.groupList.push({
          name: len,
          value: len
        });
      } else {
        let groups = Math.ceil(len / 10);
        for (let i = 1; i <= groups; i++) {
          this.groupList.push({
            value: i * 10,
            name: i * 10
          });
        }
      }
      setTimeout(() => {
        this.selectGroup = this.groupList[0].value;
      }, 0);
    },
    changeFea () {
      this.selectGroup = 0;
    },
    changeHandler () {},
    returnHandler () {
      this.$router.push({ path: '/content/building' });
    },
    outputConfirm () {
      this.outputFlag = false;
    },
    outputCancel () {
      this.outputFlag = false;
    },
    selectMethods (index) {
      this.outputFlag = true;
      this.selectIndex = index;
    }
  }
};
</script>
<style lang='scss' scoped>
@import './style/result.scss';
</style>
<style lang='scss'>
.el-switch__core {
  border: 1px solid #fff !important;
  height: 16px;
  &::after {
    background: #F6B421;
    height: 18px;
    width: 18px;
    top: -2px;
  }
}
</style>
