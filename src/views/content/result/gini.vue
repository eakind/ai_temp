<template>
  <div class="gini">
    <div class="title">GINI={{gini}}</div>
    <div class="chart" ref="gini" id="gini"></div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { get } from '@/api/server';
import { chartMixin } from '../mixins/chartMixin.js';
import { resultMixin } from '../mixins/resultMixin.js';
export default {
  data () {
    return {
      timer: null,
      gini: 0,
      targetData: []
    };
  },
  mixins: [chartMixin, resultMixin],
  props: {
    isDownload: {
      type: String
    },
    group: {
      type: Number
    },
    dataSource: {
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
          this.gainChart();
        }, 500);
      },
      deep: true,
      immediate: true
    },
    isDownload (val) {
      let size = {};
      switch (val) {
        case 'data':
          this.downloadData('gainChart');
          break;
        case 'image':
          size = {
            width: this.$el.clientWidth,
            height: this.$el.clientHeight
          };
          this.saveImage(size, '#gini');
          break;
      }
    }
  },
  mounted () {
    this.initChart();
  },
  methods: {
    initChart () {
      this.$set(this.chartObj, 'bindto', '#gini');
      this.$set(this.chartObj, 'type', 'numeric');
      this.$set(this.chartObj, 'divide', {
        show: true,
        color: '#ffffff',
        width: 2
      });
      this.$set(this.chartObj.x, 'name', 'cumvol');
      this.$set(this.chartObj.x.grid, 'show', true);
      this.$set(this.chartObj.x.axis, 'format', false);
      let combined = [];
      this.lineCombined.name = 'cumactual';
      this.lineCombined.axis = 'y';
      this.lineCombined.style.stroke.color = '#2193F6';
      this.lineCombined.style.point.color = '#2193F6';
      this.lineCombined.style.point.type = 'circle';
      combined.push(this.lineCombined);
      this.$set(this.chartObj, 'combined', combined);
    },
    createChart () {
      let dom = this.$refs.gini;
      dom.innerHTML = '';
      let div = document.createElement('div');
      div.id = this.chartObj.bindto.slice(1);
      let width = dom.clientWidth;
      let height = dom.clientHeight;
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
    async gainChart () {
      let param = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        dataset: this.dataSource,
        sampling: this.outputItem.sampling
      };
      let res = await get('gainChart', param);
      if (res.code) {
        this.$message({
          message: this.$t(res.code),
          type: 'warning'
        });
        return;
      }
      // eslint-disable-next-line no-undef
      let data = d3.csvParse(res, (d) => d);
      this.gini = Number(data[0].gini).toFixed(4);
      this.targetData = [];
      for (let i = 0; i < data.length; i++) {
        this.targetData.push({
          cumvol: +data[i].cumvol > 1 ? 1 : +data[i].cumvol,
          cumactual: +data[i].cumactual > 1 ? 1 : +data[i].cumactual
        });
      }
      this.createChart();
    }
  }
};
</script>
<style lang='scss' scoped>
.gini {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  .title {
    height: 32px;
    line-height:32px;
    position: relative;
    &::after {
      content: '';
      display: inline-block;
      height: 1px;
      width: 50px;
      background: #F6B421;
      position: absolute;
      left: 0px;
      bottom: 0px;
    }
  }
  .chart {
    height: calc(100% - 40px);
  }
}
</style>
