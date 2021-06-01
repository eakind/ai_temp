<template>
  <div class="ks-chart">
    <div class="chart-panel">
      <div class="info-panel" v-if="targetData.length">
        <chart-legend class="legend" title-txt="fpr"></chart-legend>
        <chart-legend class="legend" title-txt="tpr"></chart-legend>
        <chart-legend class="legend" title-txt="ks"></chart-legend>
        <div class="info-item padding-style" v-if="ksObj">KS:{{ksObj.ks_score}}</div>
        <div class="info-item" v-if="ksObj">最优阈值：{{ksObj.best_threshold}}</div>
        <div class="info-item" v-if="bestScore">最优分数：{{bestScore}}</div>
      </div>
      <div class="chart" id="ksChart" ref="ksChart"></div>
    </div>
    <div class="table" v-if="list.length !== 0">
      <div class="table-list table-operate">
        <div @click="settingFlag=true">
          <span>分数映射</span>
          <span><span class="iconfont icon-db_edit"></span>设置</span>
        </div>
        <div>
          分数段间隔
          <drop-list :list="groupList" :select="selectGroup" class="drop-list" @on-change="changeGroupHandler"></drop-list>
        </div>
      </div>
      <div class="table-list table-header">
        <span class="item" v-for="(item, hIdx) in headerList" :key="hIdx">{{item}}</span>
      </div>
      <scroll-list class="table-body" @loadMore="loadMore">
        <div class="body-list table-list" v-for="(item, tIdx) in list" :key="tIdx">
          <span class="item" v-for="(childItem, cIdx) in headerArr" :key="cIdx">{{item[childItem]}}</span>
        </div>
      </scroll-list>
    </div>
    <score-map-setting v-if="settingFlag" :settingFlag="settingFlag" @on-cancel="cancelHandler" @on-confirm="confirmHandler"></score-map-setting>
  </div>
</template>
<script>
import ChartLegend from './chartLegend.vue';
import ScrollList from '@/components/scrollList/index.vue';
import DropList from '@/components/dropList/index.vue';
import ScoreMapSetting from './ks/scoreMapSetting.vue';
import { chartMixin } from '../mixins/chartMixin.js';
import { resultMixin } from '../mixins/resultMixin.js';
import { mapState } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      headerList: ['分数区间', '正样本比例', '累计正样本比例', '样本量', '累计样本量', '负样本比例', '累计负样本比例', '通过率'],
      headerArr: ['分数区间', '正样本比例', '累计正样本比例', '样本量', '累计样本量', '负样本比例', '累计负样本比例', '通过率'],
      list: [],
      groupList: [{
        name: 5,
        value: 5
      }, {
        name: 10,
        value: 10
      }, {
        name: 20,
        value: 20
      }, {
        name: 50,
        value: 50
      }],
      selectGroup: 50,
      settingFlag: false,
      timer: null,
      targetData: [],
      bestScore: null,
      ksObj: null
    };
  },
  mixins: [chartMixin, resultMixin],
  components: {
    ChartLegend,
    ScrollList,
    DropList,
    ScoreMapSetting
  },
  props: {
    dataSource: {
      type: String
    },
    isDownload: {
      type: String
    }
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('result', ['outputItem'])
  },
  watch: {
    outputItem: {
      handler (obj) {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          this.initChart();
          this.getKs();
          this.getScorePerformance();
        }, 500);
      },
      deep: true,
      immediate: true
    },
    dataSource () {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.initChart();
        this.getKs();
        this.getScorePerformance();
      }, 500);
    },
    isDownload (val) {
      let size = {};
      switch (val) {
        case 'data':
          this.downloadData();
          break;
        case 'image':
          size = {
            with: this.$el.clientWidth,
            height: this.$el.clientHeight
          };
          this.saveImage(size, '#ksChart');
          break;
      }
    }
  },
  created () {
  },
  methods: {
    initChart () {
      this.$set(this.chartObj, 'bindto', '#ksChart');
      this.$set(this.chartObj, 'type', 'numeric');
      this.$set(this.chartObj.x, 'name', 'index');
      this.$set(this.chartObj.x.grid, 'show', true);
      this.$set(this.chartObj.x.axis, 'format', false);
      let combined = [];
      let lineCombined1 = JSON.parse(JSON.stringify(this.lineCombined));
      this.$set(lineCombined1, 'name', 'fpr');
      this.$set(lineCombined1, 'axis', 'y');
      let style1 = lineCombined1.style;
      style1.stroke.color = '#F5282D';
      style1.point.type = 'circle';
      style1.point.color = '#F5282D';
      this.$set(lineCombined1, 'tooltip', {
        title: 'group',
        value: 'fpr'
      });
      let lineCombined2 = JSON.parse(JSON.stringify(this.lineCombined));
      this.$set(lineCombined2, 'name', 'tpr');
      this.$set(lineCombined2, 'axis', 'y');
      let style2 = lineCombined2.style;
      style2.stroke.color = '#8543E0';
      style2.point.type = 'circle';
      style2.point.color = '#8543E0';
      this.$set(lineCombined2, 'tooltip', {
        title: 'group',
        value: 'tpr'
      });
      let lineCombined3 = JSON.parse(JSON.stringify(this.lineCombined));
      this.$set(lineCombined3, 'name', 'ks');
      this.$set(lineCombined3, 'axis', 'y');
      let style3 = lineCombined3.style;
      style3.stroke.color = '#FACC14';
      style3.point.type = 'circle';
      style3.point.color = '#FACC14';
      this.$set(lineCombined3, 'tooltip', {
        title: 'group',
        value: 'ks'
      });
      combined.push(lineCombined3);
      combined.push(lineCombined2);
      combined.push(lineCombined1);
      this.$set(this.chartObj, 'combined', combined);
    },
    createChart () {
      let dom = this.$refs.ksChart;
      dom.innerHTML = '';
      let div = document.createElement('div');
      div.id = this.chartObj.bindto.slice(1);
      let width = dom.clientWidth;
      let height = dom.clientHeight;
      if (((width - 100) / 10) < 55) {
        this.$set(this.chartObj.x.axis, 'hide', 2);
      } else {
        this.$set(this.chartObj.x.axis, 'hide', 1);
      }
      this.$set(this.chartObj.size, 'width', width);
      this.$set(this.chartObj.size, 'height', height);
      this.$set(this.chartObj, 'data', this.targetData);
      dom.appendChild(div);
      // eslint-disable-next-line no-undef
      if (ai) {
        // eslint-disable-next-line no-undef
        ai.generate(this.chartObj);
      }
    },
    async getKs () {
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        dataset: this.dataSource,
        sampling: this.outputItem.sampling
      };
      this.targetData = [];
      let res = await get('ks', params);
      if (res.code === 0) {
        this.bestScore = res.best_score;
        this.ksObj = res.v;
        if (this.ksObj && this.ksObj.fpr.length) {
          this.ksObj.fpr.forEach((item, index) => {
            this.targetData.push({
              fpr: item
            });
          });
        }
        if (this.ksObj && this.ksObj.ks.length) {
          this.ksObj.ks.forEach((item, index) => {
            this.targetData[index].ks = item;
            this.targetData[index].index = index;
          });
        }
        if (this.ksObj && this.ksObj.tpr.length) {
          this.ksObj.tpr.forEach((item, index) => {
            this.targetData[index].tpr = item;
          });
        }
        this.createChart();
      }
    },
    async getScorePerformance () {
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        bins: this.selectGroup,
        sampling: this.outputItem.sampling
      };
      this.list = [];
      let res = await get('scorePerformance', params);
      // eslint-disable-next-line no-undef
      let data = d3.csvParse(res, (d) => d);
      this.list = data;
    },
    loadMore () {},
    changeGroupHandler (item) {
      this.selectGroup = item.value;
      this.getScorePerformance();
    },
    cancelHandler () {
      this.settingFlag = false;
    },
    confirmHandler () {
      this.settingFlag = false;
      this.getScorePerformance();
    }
  }
};
</script>
<style lang='scss' scoped>
.ks-chart {
  height: calc(100% - 24px);
  width: 100%;
  box-sizing: border-box;
  .chart-panel {
    margin-top: 24px;
    height: 500px;
    width: 100%;
    margin-bottom: 16px;
    display: flex;
    .info-panel {
      width: 152px;
      position: relative;
      .legend{
        line-height: 30px;
        top: 0px;
        font-size: 14px;
        position: absolute;
        &:nth-child(1){
          left: 70px;
          top: -8px;
        }
        &:nth-child(2){
          left: 70px;
          top: 28px;
        }
        &:nth-child(3){
          left: 70px;
          top: 62px;
        }
      }
      .info-item {
        color: #F6B421;
        line-height: 36px;
        @include ellipsis;
      }
      .padding-style {
        padding-top: 100px;
      }
    }
    .chart {
      height: 100%;
      flex: 1;
    }
  }
  .table {
    height: calc(100% - 516px);
    width: 100%;
    .table-list {
      width: 100%;
      height: 36px;
      line-height: 36px;
      >span {
        display: inline-block;
        font-size: 12px;
        height: 36px;
        width: calc(100% / 8);
        padding: 0px 4px;
        line-height: 36px;
        text-align: center;
        box-sizing: border-box;
        border-right: 1px solid #2B2B2B;
        border-bottom: 1px solid #2B2B2B;
        @include ellipsis;
        &:last-child {
          border-right: none;
        }
      }
    }
    .table-header {
      background: #333;
      >span {
        color: #FCF8DF;
        font-weight: 600;
      }
    }
    .table-body {
      height: calc(100% - 72px);
      @include scrollBar(#a4a4a4, 0px);
    }
    .body-list {
      background: #444444;
      >span {
        &:first-child {
          text-align: left;
        }
      }
    }
    .table-operate {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 4px;
      background: #333;
      line-height: 40px;
      height: 40px;
      border-bottom: 1px solid #2B2B2B;
      >div:nth-child(1) {
        >span:nth-child(1) {
          margin: 0px 24px 0px 8px;
          color: #F6B421;
        }
        >span:nth-child(2){
          cursor: pointer;
          .icon-db_edit {
            color: #F6B421;
            margin-right: 12px;
          }
        }
      }
      >div:nth-child(2) {
        .drop-list {
          width: 75px;
        }
      }
    }
  }
}
</style>
