import { get, post } from '@/api/server';
import { mapState, mapMutations } from 'vuex';
import { chartMixin } from './chartMixin.js';
export const setTarget = {
  mixins: [chartMixin],
  data: () => {
    return {
      timer: null
    };
  },
  computed: {
    ...mapState('content', ['targetData'])
  },
  beforeDestroy () {
    this.bus.$off('refreshTargetChart');
  },
  mounted () {
    this.initChart();
    this.getDistribution();
    this.bus.$on('refreshTargetChart', () => {
      this.getTargetChartData();
    });
  },
  methods: {
    ...mapMutations('content', ['setTargetData', 'setMetricsSelect']),
    async getDistribution () {
      if (!this.targetFeature) {
        return;
      }
      let params = {
        project_id: this.projectId,
        feature_idx: this.targetFeature.feature_idx
      };
      let res = await get('distribution', params);
      if (res.code) return;
      // eslint-disable-next-line no-undef
      let data = d3.csvParse(res, (d) => d);
      this.setTargetData(data);
      this.createChart();
    },
    getTargetChartData () {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.getDistribution();
      }, 500);
    },
    initChart () {
      this.$set(this.chartObj, 'bindto', '#targetChart');
      this.$set(this.chartObj, ' type', 'category');
      let combined = [];
      let barCombined = JSON.parse(JSON.stringify(this.barCombined));
      barCombined.name = 'frequency';
      barCombined.tooltip = {
        range: '',
        title: '',
        value: 'frequency'
      };
      combined.push(barCombined);
      this.$set(this.chartObj, 'combined', combined);
    },
    setChart (width, height, data, name, range, value) {
      this.$set(this.chartObj, 'data', data);
      this.$set(this.chartObj.size, 'width', width);
      this.$set(this.chartObj.size, 'height', height);
      this.$set(this.chartObj.x, 'name', name);
      this.$set(this.chartObj.padding, 'right', 20);
      if (data.length > 10) {
        let show = Math.floor((width - 100) / 80);
        this.$set(this.chartObj.x.axis, 'hide', Math.ceil(40 / show));
      } else {
        this.$set(this.chartObj.x.axis, 'hide', 1);
      }
      let combined = this.chartObj.combined;
      this.$set(combined[0].tooltip, 'range', range);
      this.$set(combined[0].tooltip, 'value', value);
      let barW = Math.floor(width / (data.length * 1.8));
      if (barW > 500) {
        barW = 500;
      };
      this.$set(combined[0].style, 'band', barW);
      this.$set(combined[0].style, 'fill', 'rgba(33,147,246, 1)');

      this.$set(this.chartObj.padding, 'left', this.getPadding('frequency', data));
    },
    createChart () {
      let [data, name, range, value] = this.setData(this.targetData); // 根据接口请求数据，返回画图相关数据
      let dom = this.$refs.tChart;
      let width = dom.clientWidth;
      let height = dom.clientHeight;
      this.setChart(width, height, data, name, range, value); // 设置画图参数
      this.appendChart(dom);
    },
    async changeMetrics (item) {
      let param = {
        project_id: this.projectId,
        optimize_metric: item.value
      };
      let res = await post('postMetricModel', param);
      if (res.code === 0) {
        this.setMetricsSelect(item.name);
      }
    }
  }
};
