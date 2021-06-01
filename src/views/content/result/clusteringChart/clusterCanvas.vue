<template>
  <div class="cluster-canvas" id="cluster">
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import { get } from '@/api/server';
import { drawCluster, showLabelInfo } from './drawCluster';
import { resultMixin } from '../../mixins/resultMixin.js';
export default {
  mixins: [resultMixin],
  data () {
    return {
      data: [],
      pointData: [],
      posObj: null
    };
  },
  props: {
    group: {
      type: [Number, String]
    }
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('result', ['outputItem', 'selectLabel', 'xrayObj', 'labelList'])
  },
  watch: {
    selectLabel: {
      handler (obj) {
        if (obj.posObj) this.posObj = JSON.parse(JSON.stringify(obj.posObj));
        showLabelInfo(this.selectLabel, this.xrayObj, this.posObj);
      },
      deep: true
    },
    xrayObj: {
      handler (obj) {
        showLabelInfo(this.selectLabel, this.xrayObj, this.posObj);
      },
      deep: true
    },
    group: {
      handler (val) {
        this.drawCanvas();
      },
      deep: true
    }
  },
  components: {
  },
  beforeDestroy () {
    this.setSelectLabel({});
    this.setTotalCluster(0);
    window.removeEventListener('cancelDom', this.cancelDomHandler);
    window.removeEventListener('selectDom', this.selectDomHandler);
    let dom = document.querySelector('#tooltipChart');
    if (dom) {
      document.body.removeChild(dom);
    }
  },
  mounted () {
    window.addEventListener('selectDom', this.selectDomHandler);
    window.addEventListener('cancelDom', this.cancelDomHandler);
    this.getDrawData();
  },
  methods: {
    ...mapMutations('result', ['setLabelList', 'setSelectLabel', 'setTotalCluster']),
    selectDomHandler (e) {
      let label = e.detail.data.label;
      this.posObj = e.detail.posObj;
      let current = this.labelList.filter(item => item.name === label)[0];
      if (this.selectLabel.name === current.name) {
        this.setSelectLabel({});
      } else {
        this.setSelectLabel(current);
      }
      showLabelInfo(this.selectLabel, this.xrayObj, this.posObj);
    },
    cancelDomHandler () {
      this.setSelectLabel({});
    },
    async getDrawData () {
      let param = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        sampling: this.outputItem.sampling
      };
      let res = await get('clustering2d', param);
      // eslint-disable-next-line no-undef
      this.data = d3.csvParse(res, (d) => d);
      this.getCenter(param);
    },
    // 获取各分组的中心点
    async getCenter () {
      let param = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        sampling: this.outputItem.sampling
      };
      let res = await get('clusteringCentroid', param);
      // eslint-disable-next-line no-undef
      this.pointData = d3.csvParse(res, (d) => d);
      this.setTotalCluster(this.pointData.length);
      setTimeout(() => {
        this.drawCanvas();
      });
    },
    drawCanvas () {
      // 按分组取数据
      let data = this.cutData();
      let labelList = drawCluster('#cluster', data, this.pointData, this.selectLabel, this.xrayObj, this.posObj);
      this.setLabelList(labelList);
    },
    cutData () {
      let data = [];
      let list = this.data;
      let arr = [];
      let group = this.group;
      if (group === 0) group = 5;
      if (group === 'total') return list;
      for (let i = 0, len = list.length; i < len; i++) {
        if (!arr.includes(list[i].label))arr.push(list[i].label);
        if (arr.length >= group + 1) return data;
        data.push(list[i]);
      }
      return data;
    }
  }
};
</script>
<style lang='scss' scoped>
.cluster-canvas {
  flex: 1;
  width: 0;
  height: 100%;
  border-radius: 4px;
  background: #222222;
  border: 1px solid #424242;
}
</style>
