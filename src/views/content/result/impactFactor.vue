<template>
  <div class="impact-factor" id="impactId" ref="impact">
  </div>
</template>
<script>
import { chartMixin } from '../mixins/chartMixin.js';
import { resultMixin } from '../mixins/resultMixin.js';
import { mapState } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      targetData: [],
      timer: null
    };
  },
  mixins: [chartMixin, resultMixin],
  computed: {
    ...mapState(['projectId']),
    ...mapState('result', ['outputItem'])
  },
  props: {
    isDownload: {
      type: String
    },
    group: {
      type: Number
    }
  },
  watch: {
    outputItem: {
      handler (obj) {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          this.importance();
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
        this.importance();
      }, 500);
    },
    isDownload (val) {
      let size = {};
      switch (val) {
        case 'data':
          this.downloadData('importance');
          break;
        case 'image':
          size = {
            width: this.$el.clientWidth,
            height: this.$el.clientHeight
          };
          this.saveImage(size, '#impactId');
          break;
      }
    },
    group () {
      if (!this.group) return;
      this.createChart(this.group);
    }
  },
  mounted () {
    this.initChart();
  },
  methods: {
    initChart () {
      this.$set(this.chartObj, 'bindto', '#factor');
      this.$set(this.chartObj, 'type', 'category');
      this.$set(this.chartObj.x, 'name', 'factor');
      this.$set(this.chartObj, 'rotate', true);
      let combined = [];
      this.$set(this.barCombined, 'name', 'percent');
      let toolTipObj = {
        title: 'factor',
        value: 'percent'
      };
      // this.$set(this.barCombined, 'tooltip', toolTipObj);
      this.$set(this.barCombined.style, 'fill', '#2193F6');
      // this.$set(this.barCombined.style, 'radius', 5);
      combined.push(this.barCombined);
      this.$set(this.chartObj.tooltip, 'content', toolTipObj);
      this.$set(this.chartObj, 'combined', combined);
      this.$set(this.chartObj.padding, 'left', 400);
    },
    createChart (group) {
      let dom = this.$refs.impact;
      let width = dom.clientWidth;
      let height = dom.clientHeight;
      let data = this.targetData.slice(0, group);
      let barW = Math.floor(height / (group * 1.8));
      if (barW > 100) barW = 100;
      this.$set(this.chartObj.size, 'width', width);
      this.$set(this.chartObj.size, 'height', height);
      this.$set(this.chartObj.combined[0].style, 'band', barW);
      let show = Math.floor((height - 100) / 25);
      this.$set(this.chartObj.x.axis, 'hide', Math.ceil(group / show));
      // this.$set(this.chartObj.padding, 'left', getPadding(data));
      this.$set(this.chartObj, 'data', data);
      delete this.chartObj.y2;
      this.appendChart(dom);
    },
    async importance () {
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        dataset: 'VALIDATE',
        sampling: this.outputItem.sampling
      };
      let res = await get('importance', params);
      if (res.code) {
        this.$message({
          message: this.$t(res.code),
          type: 'warning'
        });
        return;
      }
      this.targetData = [];
      // eslint-disable-next-line no-undef
      let data = d3.csvParse(res, (d) => d);
      for (let i in data) {
        this.targetData.push({
          factor: data[i].feature,
          percent: +data[i].normalized
        });
      }
      this.$emit('setGroup', data.length);
    }
  }
};
</script>
<style lang='scss' scoped>
.impact-factor {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  position: relative;
}
</style>
