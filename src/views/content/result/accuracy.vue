<template>
  <div class="accuracy" id="accuracyId">
    <div class="header">
      <chart-legend class="legend" title-txt="实际值"></chart-legend>
      <chart-legend class="legend" title-txt="预测值" :title-val="yMean"></chart-legend>
    </div>
    <div class="chart" ref="aChart"></div>
     <span class="chart-title">分组数</span>
  </div>
</template>
<script>
import ChartLegend from './chartLegend.vue';
import { chartMixin } from '../mixins/chartMixin.js';
import { resultMixin } from '../mixins/resultMixin.js';
import { mapState } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      targetData: [],
      timer: null,
      yMean: ''
    };
  },
  props: {
    dataSource: {
      type: String
    },
    group: {
      type: Number
    },
    isDownload: {
      type: String
    }
  },
  mixins: [chartMixin, resultMixin],
  components: {
    ChartLegend
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
          this.getAuc();
          this.getLiftChart();
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
        this.getAuc();
        this.getLiftChart();
      }, 500);
    },
    group () {
      if (!this.group) return;
      this.createChart(this.group);
    },
    isDownload (val) {
      let size = {};
      switch (val) {
        case 'data':
          this.downloadData('liftChart');
          break;
        case 'image':
          size = {
            with: this.$el.clientWidth,
            height: this.$el.clientHeight
          };
          this.saveImage(size, '#accuracyId');
          break;
      }
    }
  },
  created () {
    this.initChart();
  },
  mounted () {},
  methods: {
    initChart () {
      this.$set(this.chartObj, 'bindto', '#accuracy');
      this.$set(this.chartObj, 'type', 'numeric');
      this.$set(this.chartObj.x, 'name', 'group');
      this.$set(this.chartObj.x.grid, 'show', true);
      this.$set(this.chartObj.x.axis, 'format', false);
      this.$set(this.chartObj.padding, 'right', 50);
      this.$set(this.chartObj.y.axis, 'percent', true);
      let combined = [];
      let lineCombined1 = JSON.parse(JSON.stringify(this.lineCombined));
      this.$set(lineCombined1, 'name', 'Lift curve');
      this.$set(lineCombined1, 'axis', 'y');
      let style1 = lineCombined1.style;
      style1.stroke.color = '#FCF8DF';
      style1.point.type = 'circle';
      style1.point.color = '#FCF8DF';
      this.$set(lineCombined1, 'tooltip', {
        title: 'group',
        value: 'Lift curve'
      });
      let lineCombined2 = JSON.parse(JSON.stringify(this.lineCombined));
      this.$set(lineCombined2, 'name', 'Baseline');
      this.$set(lineCombined2, 'axis', 'y');
      let style2 = lineCombined2.style;
      style2.stroke.color = '#F6B421';
      style2.point.type = 'cross';
      style2.point.color = '#F6B421';
      this.$set(lineCombined2, 'tooltip', {
        title: 'group',
        value: 'Baseline'
      });
      combined.push(lineCombined2);
      combined.push(lineCombined1);
      this.$set(this.chartObj, 'combined', combined);
    },
    createChart (group) {
      let dom = this.$refs.aChart;
      let width = dom.clientWidth;
      let height = dom.clientHeight;
      this.$set(this.chartObj.size, 'width', width);
      this.$set(this.chartObj.size, 'height', height);
      let data = this.setChartData(group);
      this.$set(this.chartObj, 'data', data);
      this.appendChart(dom);
    },
    setChartData (index) {
      let data = this.targetData;
      let group = Math.floor(data.length / index);
      let arr = [];
      for (let i = 0; i < index; i++) {
        let obj = {
          group: i
        };
        let actualGroup = 0;
        let predictedGroup = 0;
        for (let j = 0; j < group; j++) {
          let actual = Number(data[i * group + j].actual);
          let predicted = Number(data[i * group + j].predicted);
          actualGroup += actual;
          predictedGroup += predicted;
        }
        obj['Lift curve'] = Number((actualGroup / group).toFixed(4));
        obj.Baseline = Number((predictedGroup / group).toFixed(4));
        arr.push(obj);
      }
      return arr;
    },
    async getAuc () {
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        sampling: this.outputItem.sampling,
        dataset: this.dataSource
      };
      let res = await get('auc', params);
      if (res.code === 0) {
        // eslint-disable-next-line no-prototype-builtins
        if (res.hasOwnProperty('y_mean')) {
          this.yMean = Number(res.y_mean).toFixed(4);
        } else {
          this.yMean = '';
        }
      }
    },
    getLiftChart () {
      this.liftChart(true);
    },
    async liftChart (flag) {
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        dataset: this.dataSource,
        sampling: this.outputItem.sampling
      };
      this.targetData = [];
      let res = await get('liftChart', params);
      if (res.code) {
        this.$message({
          message: this.$t(res.code),
          type: 'warning'
        });
        return;
      }
      // eslint-disable-next-line no-undef
      let data = d3.csvParse(res, (d) => d);
      for (let i = 0; i < data.length; i++) {
        this.targetData.push({
          group: +data[i].index,
          // eslint-disable-next-line no-prototype-builtins
          actual: data[i].hasOwnProperty('actual') ? +data[i].actual : +data[i].lift,
          // eslint-disable-next-line no-prototype-builtins
          predicted: data[i].hasOwnProperty('predicted') ? +data[i].predicted : +data[i].baseline
        });
      }
      this.$emit('setGroup', data.length);
      if (flag) {
        this.createChart(this.group);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.accuracy {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  .header {
    height: 30px;
    position: relative;
    .legend{
      line-height: 30px;
      top: 0px;
      font-size: 14px;
      position: absolute;
      &:nth-child(1){
        right: 140px;
      }
      &:nth-child(2){
        right: 0px;
      }
    }
  }
  .chart {
    height: calc(100% - 30px);
    width: 100%;
  }
  .chart-title{
    right: 60px;
    bottom: 10px;
    position: absolute;
  }
}
</style>
