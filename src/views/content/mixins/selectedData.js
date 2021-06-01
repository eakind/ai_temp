import { get } from '@/api/server';
import { mapState, mapMutations } from 'vuex';
import downloadImage from '@/utils/downloadImage';
import { chartMixin } from '../mixins/chartMixin.js';
export const selectedData = {
  mixins: [chartMixin],
  data: () => {
    return {
      timer: null,
      selectedObj: null,
      selected: 20
    };
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('content', ['selectedData', 'selectedFeature', 'targetFeature', 'metricsSelect'])
  },
  watch: {
    selectedFeature: {
      handler (obj) {
        if (this.selectedObj) {
          if (this.selectedObj.feature_idx === obj.feature_idx) {
            return;
          }
        }
        this.selectedObj = JSON.parse(JSON.stringify(obj));
        this.getChartData();
      },
      deep: true,
      immediate: true
    },
    selectedData: {
      handler (list) {
        let len = list.length;
        if (len > 60) {
          len = 60;
        }
        let total = Math.ceil(len / 10);
        this.numList = [];
        if (total > 6) {
          total = 6;
        }
        for (let i = 1; i <= total; i++) {
          this.numList.push({
            name: Math.floor(len / i),
            value: Math.floor(len / i)
          });
        }
      },
      deep: true
    }
  },
  beforeDestroy () {
    this.bus.$off('refreshSelected');
  },
  mounted () {
    this.initChart();
    this.bus.$on('refreshSelected', () => {
      this.getSelectedDetail();
    });
  },
  methods: {
    ...mapMutations('content', ['setSelectedData', 'setSelectedFeature']),
    initChart () {
      this.$set(this.chartObj, 'bindto', '#selectChart');
      this.$set(this.chartObj, 'type', 'category');
      let combined = [];
      let barCombined = JSON.parse(JSON.stringify(this.barCombined));
      let lineCombined = JSON.parse(JSON.stringify(this.lineCombined));
      barCombined.name = 'frequency';
      barCombined.tooltip = {
        title: '',
        value: 'frequency',
        range: ''
      };
      lineCombined.name = 'target';
      lineCombined.style.point.border = 1;
      lineCombined.tooltip = {
        title: '',
        value: 'target',
        range: ''
      };
      combined.push(barCombined, lineCombined);
      this.$set(this.chartObj, 'combined', combined);
    },
    getChartData () {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.getDistribution();
      }, 500);
    },
    async getSelectedDetail () {
      let param = {
        project_id: this.projectId,
        feature_idx: this.selectedFeature.feature_idx
      };
      let res = await get('featureDetail', param);
      if (res.code === 0) {
        this.setSelectedFeature(res);
        this.getChartData();
      }
    },
    async getDistribution () {
      if (!this.projectId) return;
      if (!this.selectedFeature) return;
      let params = {
        project_id: this.projectId,
        feature_idx: this.selectedFeature.feature_idx
      };
      let res = await get('distribution', params);
      if (res.code) return;
      // eslint-disable-next-line no-undef
      let data = d3.csvParse(res, (d) => d);
      if (!data.length) return;
      this.selected = 20;
      this.setSelectedData(data);
      // eslint-disable-next-line no-prototype-builtins
      if (data[0].hasOwnProperty('start')) {
        if (data.length < 60) {
          this.createChart(data.length);
        } else {
          this.createChart(this.selected);
        }
      } else {
        if (data.length < 10) {
          this.createChart(10);
        } else {
          this.createChart(this.selected);
        }
      }
    },
    changeNum (item) {
      if (this.selectedData.length === 0) return;
      this.createChart(item.value);
    },
    async downloadImg () {
      let size = {
        width: this.$el.querySelector('#selectedChart').clientWidth,
        height: this.$el.querySelector('#selectedChart').clientHeight
      };
      await downloadImage({
        node: '#selectedChart',
        name: `${new Date().getTime()}.jpg`,
        size: size,
        backgroundColor: '#2B2B2B',
        errorMsg: ''
      });
    },
    createChart (index) {
      let [data, name, range, value] = this.setData(this.selectedData, index);
      let dom = this.$refs.sChart;
      let width = dom.clientWidth;
      let height = dom.clientHeight;
      this.setChart(width, height, data, name, range, value, index);
      this.appendChart(dom);
    },
    setChart (width, height, data, name, range, value, index) {
      this.$set(this.chartObj, 'data', data);
      this.$set(this.chartObj.size, 'width', width);
      this.$set(this.chartObj.size, 'height', height);
      this.$set(this.chartObj.x, 'name', name);
      if (data.length > 10) {
        let show = Math.floor((width - 100) / 80);
        this.$set(this.chartObj.x.axis, 'hide', Math.ceil(index / show));
      } else if (data.length === 10) {
        if (this.$route.name === 'feature') {
          let show = Math.floor((width - 100) / 80);
          this.$set(this.chartObj.x.axis, 'hide', Math.ceil(index / show));
        } else {
          this.$set(this.chartObj.x.axis, 'hide', 1);
        }
      } else {
        this.$set(this.chartObj.x.axis, 'hide', 1);
      }
      let combined = this.chartObj.combined;
      let paddingRight = this.getPadding('target', data);
      let paddingLeft = this.getPadding('frequency', data);
      if (name === 'value') {
        this.$set(combined[0], 'value', 'frequency');
      }
      this.$set(combined[0].tooltip, 'range', range);
      this.$set(combined[1].tooltip, 'range', range);
      let barW = Math.floor(width / (data.length * 1.8));
      if (barW > 500) {
        barW = 500;
      };
      this.$set(combined[0].style, 'band', barW);
      this.$set(this.chartObj.padding, 'left', paddingLeft < 50 ? 50 : paddingLeft);
      this.$set(this.chartObj.padding, 'right', paddingRight < 50 ? 50 : paddingRight);
    }
  }
};
