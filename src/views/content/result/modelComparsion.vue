<template>
  <div class="model-comparsion">
    <div class="comparsion-left">
      <div>模型1<drop-list :list="modelList" :select="model1" :filter="model2" class="drop-list" @on-change="changeModel1"></drop-list></div>
      <div>模型2<drop-list :list="modelList" :select="model2" :filter="model1" class="drop-list" @on-change="changeModel2"></drop-list></div>
      <div class="model-data"  v-if="aucList.length > 1">
        <div class="data-item data-header">
          <span></span>
          <span>模型1</span>
          <span>模型2</span>
        </div>
        <div v-if="modelType === 'REGRESSION'">
          <div class="data-item">
            <span>RMSE</span>
            <span>{{aucList[0].rmse}}</span>
            <span>{{aucList[1].rmse}}</span>
          </div>
          <div class="data-item">
            <span>MAE</span>
            <span>{{aucList[0].mae}}</span>
            <span>{{aucList[1].mae}}</span>
          </div>
          <div class="data-item">
            <span>Gini</span>
            <span>{{aucList[0].gini}}</span>
            <span>{{aucList[1].gini}}</span>
          </div>
          <div class="data-item">
            <span>NormGini</span>
            <span>{{aucList[0].normgini}}</span>
            <span>{{aucList[1].normgini}}</span>
          </div>
        </div>
        <div v-else>
          <div class="data-item">
            <span>AUC</span>
            <span>{{aucList[0].auc}}</span>
            <span>{{aucList[1].auc}}</span>
          </div>
          <div class="data-item">
            <span>ACC</span>
            <span>{{aucList[0].acc}}</span>
            <span>{{aucList[1].acc}}</span>
          </div>
          <div class="data-item">
            <span>Specificity</span>
            <span>{{aucList[0].specificity}}</span>
            <span>{{aucList[1].specificity}}</span>
          </div>
          <div class="data-item">
            <span>Sensitivity</span>
            <span>{{aucList[0].sensitivity}}</span>
            <span>{{aucList[1].sensitivity}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="comparsion-right">
      <div class="right-header">
        <div v-if="dataList.length">数据源<drop-list :list="dataList" :select="selectSource" class="drop-list" @on-change="changeSource"></drop-list></div>
        <div class="legend-box">
            <chart-legend class="legend" title-txt="模型1" @click="selectLine('line')"></chart-legend>
            <chart-legend class="legend" title-txt="模型2" @click="selectLine('line2')"></chart-legend>
        </div>
      </div>
      <div class="chart" ref="chart" id="comparsion"></div>
    </div>
  </div>
</template>
<script>
import DropList from '@/components/dropList/index.vue';
import ChartLegend from './chartLegend.vue';
import { chartMixin } from '../mixins/chartMixin.js';
import { resultMixin } from '../mixins/resultMixin.js';
import { mapMutations, mapState } from 'vuex';
import { numFormat } from '@/utils/format';
import { get } from '@/api/server';
export default {
  data () {
    return {
      model1: '',
      model2: '',
      modelItem1: null,
      modelItem2: null,
      aucList: [],
      model1Data: [],
      model2Data: [],
      lineObj: {},
      timer: null,
      dataList: [],
      dataSource: '',
      selectSource: '',
      isChangeSource: false,
      isComparing: false
    };
  },
  mixins: [chartMixin, resultMixin],
  components: {
    DropList,
    ChartLegend
  },
  props: {
    modelList: {
      type: Array
    },
    isDownload: {
      type: String
    }
  },
  watch: {
    modelList: {
      handler (list) {
        if (list.length === 0) return;
        if (this.modelItem1) {
          this.model1 = this.modelItem1.name;
        } else {
          this.model1 = this.outputItem.name;
          this.modelItem1 = this.outputItem;
        }
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          this.setSource();
          this.initChart();
          this.getAuc(this.modelItem1, 0);
          this.getData(this.modelItem1);
        }, 500);
      },
      deep: true,
      immediate: true
    },
    isDownload (val) {
      let size = {};
      switch (val) {
        case 'data':
          this.downloadData('roc');
          break;
        case 'image':
          size = {
            with: this.$el.clientWidth,
            height: this.$el.clientHeight
          };
          this.saveImage(size, '#comparsion');
          break;
      }
    }
  },
  computed: {
    ...mapState(['projectId', 'modelType']),
    ...mapState('result', ['outputItem'])
  },
  mounted () {},
  methods: {
    ...mapMutations('result', ['setOutputItem']),
    selectLine (type) {
      let combined = this.chartObj.combined;
      if (combined.length === 1) return;
      if (type === 'line') {
        this.$set(combined[1], 'isup', false);
      } else {
        this.$set(combined[2], 'isup', true);
      }
      this.makeCreate();
    },
    setSource () {
      if (this.modelList.length < 2) {
        this.setSourceList(false);
        return;
      }
      let holdout1 = this.modelItem1 ? this.modelItem1.holdout_status : null;
      let holdout2 = this.modelItem2 ? this.modelItem2.holdout_status : null;
      if (holdout1 && holdout2) {
        this.setSourceList(true);
        return;
      } else {
        if (!this.modelItem2 && holdout1) {
          this.setSourceList(true);
          return;
        }
      }
      this.setSourceList(false);
    },
    setSourceList (flag) {
      if (flag) {
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
      if (this.selectSource === this.dataList[0].name) {
        this.selectSource = false;
      }
      this.isChangeSource = true;
      this.selectSource = this.dataList[0].name;
      this.dataSource = this.dataList[0].value;
    },
    changeModel1 (item) {
      this.model1 = item.name;
      this.modelItem1 = item;
      this.setOutputItem(item);
      this.setSource();
      this.getData(item);
      this.getAuc(item, 0);
      if (this.isChangeSource && this.modelItem2) {
        this.getData(this.modelItem2);
        this.getAuc(this.modelItem2, 1);
      }
    },
    changeModel2 (item) {
      this.model2 = item.name;
      this.modelItem2 = item;
      this.setSource();
      this.getData(item);
      this.getAuc(item, 1);
      if (this.isChangeSource && this.modelItem1) {
        this.getData(this.modelItem1);
        this.getAuc(this.modelItem1, 0);
      }
    },
    changeSource (item) {
      this.selectSource = item.name;
      this.dataSource = item.value;
      if (this.modelItem1) {
        this.getAuc(this.modelItem1, 0);
        this.getData(this.modelItem1);
      }
      if (this.modelItem2) {
        this.getAuc(this.modelItem2, 1);
        this.getData(this.modelItem2);
      }
    },
    getData (item) {
      if (this.modelType !== 'REGRESSION') {
        this.getRoc(item);
      } else {
        this.gainChart(item);
      }
    },
    initChart () {
      this.$set(this.chartObj, 'bindto', '#comparsion');
      this.$set(this.chartObj, 'type', 'numeric');
      this.$set(this.chartObj, 'divide', {
        show: true,
        color: '#ffffff',
        width: 2
      });
      if (this.modelType !== 'REGRESSION') {
        this.$set(this.chartObj.x, 'name', 'fpr');
      } else {
        this.$set(this.chartObj.x, 'name', 'cumvol');
      }
      this.$set(this.chartObj.x.grid, 'show', true);
      this.$set(this.chartObj.x.axis, 'format', false);
      this.$set(this.chartObj.y2.axis.line, 'show', false);
      this.$set(this.chartObj.y2.axis.ticks, 'show', false);
      this.$set(this.chartObj.y2.axis.title, 'show', false);
    },
    setLine () {
      let combined = [];
      this.lineCombined.style.point.size = 40;
      let lineCombined1 = JSON.parse(JSON.stringify(this.lineCombined));
      if (this.modelType !== 'REGRESSION') {
        this.$set(lineCombined1, 'name', 'tpr');
      } else {
        this.$set(lineCombined1, 'name', 'cumactual');
      }
      lineCombined1.axis = 'y';
      lineCombined1.style.stroke.color = '#2193F6';
      lineCombined1.style.point.color = '#2193F6';
      lineCombined1.style.point.type = 'circle';
      combined.push(lineCombined1);
      if (this.model2Data.length) {
        let lineCombined2 = JSON.parse(JSON.stringify(this.lineCombined));
        lineCombined2.type = 'line2';
        lineCombined2.isup = true;
        if (this.modelType !== 'REGRESSION') {
          this.$set(lineCombined2, 'name', 'tpr');
        } else {
          this.$set(lineCombined2, 'name', 'cumactual');
        }
        lineCombined2.axis = 'y2';
        lineCombined2.style.stroke.color = '#EF635C';
        lineCombined2.style.point.color = '#EF635C';
        lineCombined2.style.point.type = 'circle';
        combined.push(lineCombined2);
      }
      this.$set(this.chartObj, 'combined', combined);
    },
    createChart () {
      this.setLine();
      this.makeCreate();
    },
    makeCreate () {
      let dom = this.$refs.chart;
      let width = dom.clientWidth;
      let height = dom.clientHeight;
      this.$set(this.chartObj.size, 'width', width);
      this.$set(this.chartObj.size, 'height', height);
      if (this.model1Data.length) {
        this.$set(this.chartObj, 'data', this.model1Data);
      }
      if (this.model2Data.length) {
        this.$set(this.chartObj, 'data2', this.model2Data);
      }
      this.appendChart(dom);
    },
    async getRoc (item) {
      let params = {
        project_id: this.projectId,
        model_id: item.model_id,
        dataset: this.dataSource,
        sampling: item.sampling
      };
      let res = await get('roc', params);
      if (res.code) {
        this.$message({
          message: this.$t(res.code),
          type: 'warning'
        });
        return;
      }
      // eslint-disable-next-line no-undef
      let data = d3.csvParse(res, (d) => d);
      let len = data.length;
      let isModel1 = this.modelItem1.name === item.name;
      if (isModel1) {
        this.model1Data = [];
        for (let i = 0; i < len; i++) {
          this.model1Data.push({
            fpr: Number(data[i].fpr) > 1 ? 1 : Number(data[i].fpr),
            tpr: Number(data[i].tpr) > 1 ? 1 : Number(data[i].tpr)
          });
        }
      } else {
        this.model2Data = [];
        for (let i = 0; i < len; i++) {
          this.model2Data.push({
            fpr: Number(data[i].fpr) > 1 ? 1 : Number(data[i].fpr),
            tpr: Number(data[i].tpr) > 1 ? 1 : Number(data[i].tpr)
          });
        }
      }
      this.createChart();
    },
    async gainChart (item, flag) {
      let params = {
        project_id: this.projectId,
        model_id: item.model_id,
        dataset: this.dataSource,
        sampling: item.sampling
      };
      let res = await get('gainChart', params);
      if (res.code) {
        this.$message({
          message: this.$t(res.code),
          type: 'warning'
        });
        return;
      }
      // eslint-disable-next-line no-undef
      let data = d3.csvParse(res, (d) => d);
      let len = data.length;
      let isModel1 = this.modelItem1.name === item.name;
      if (isModel1) {
        this.model1Data = [];
        for (let i = 0; i < len; i++) {
          this.model1Data.push({
            cumvol: Number(data[i].cumvol) > 1 ? 1 : Number(data[i].cumvol),
            cumactual: Number(data[i].cumactual) > 1 ? 1 : Number(data[i].cumactual)
          });
        }
      } else {
        this.model2Data = [];
        for (let i = 0; i < len; i++) {
          this.model2Data.push({
            cumvol: Number(data[i].cumvol) > 1 ? 1 : Number(data[i].cumvol),
            cumactual: Number(data[i].cumactual) > 1 ? 1 : Number(data[i].cumactual)
          });
        }
      }
      this.createChart();
    },
    async getAuc (item, index) {
      let params = {
        project_id: this.projectId,
        model_id: item.model_id,
        sampling: item.sampling,
        dataset: this.dataSource
      };
      let res = await get('auc', params);
      if (res.code === 0) {
        if (this.modelType === 'REGRESSION') {
          let obj = {
            rmse: this.setFormat(res.rmse),
            mae: this.setFormat(res.mae),
            normgini: this.setFormat(res.normgini),
            gini: this.setFormat(res.gini)
          };
          this.$set(this.aucList, index, obj);
        } else {
          let obj = {
            auc: this.setFormat(res.roc_auc),
            acc: this.setFormat(res.accuracy),
            sensitivity: this.setFormat(res.sensitivity),
            specificity: this.setFormat(res.specificity)
          };
          this.$set(this.aucList, index, obj);
        }
      }
    },
    setFormat (text) {
      return numFormat(text);
    }
  }
};
</script>
<style lang='scss' scoped>
.model-comparsion {
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  .comparsion-left {
    width: 480px;
    height: 100%;
    padding: 0px 16px;
    box-sizing: border-box;
    >div:nth-child(1), >div:nth-child(2) {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }
    .drop-list {
      box-sizing: border-box;
      width: 296px;
      border: 1px solid #F6B421;
      margin-left: 24px;
    }
    .data-item {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #424242;
      >span {
        display: inline-block;
        padding: 0px 8px;
        width: 120px;
        text-align: center;
        &:nth-child(1) {
          width: calc(100% - 288px);
          text-align: left;
        }
      }
    }
    .data-header {
      color: #FCF8DF;
      font-size: 16px;
      border-radius: 4px 4px 0px 0px;
      background: #333333;
      border-bottom: 0;
    }
  }
  .comparsion-right {
    flex: 1;
    width: 0;
    height: calc(100% - 108px);
    margin-top: 108px;
    margin-left: 84px;
    .right-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .drop-list {
        margin-left: 18px;
      }
      .legend-box {
        display: flex;
        align-items: center;
        .legend {
          position: absolute;
          cursor: pointer;
          &:nth-child(1) {
            right: 200px;
          }
          &:nth-child(2) {
            right: 35px;
          }
        }
      }
    }
    .chart {
      height: calc(100% - 200px);
      width: 100%;
      position: relative;
    }
  }
}
</style>
