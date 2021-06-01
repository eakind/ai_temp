<template>
  <div class="chart-info">
    <div class="info-header">
       <div class="info">
         <span>CH指数: {{modelMap.CH}}</span>
         <span>DB指数: {{-modelMap.DB}}</span>
         <span>轮廓指数: {{modelMap.SH}}</span>
         <span v-if="modelMap.INERTIA">inertia指数: {{-modelMap.INERTIA}}</span>
       </div>
       <div class="tip">
         <span class="tip-txt">经过tsne降维生成的聚类图表。</span>
         <span class="tip-btn" v-if="clusterFea.feature_name" @click="backAllHandler">返回全部聚类</span>
       </div>
    </div>
    <div class="cluster-container" ref="clusterContainer" :style="outContainerStyle" id="clusterChart">
      <div class="info-body">
        <cluster-canvas ref="chartRef" :group="group"></cluster-canvas>
        <label-list></label-list>
      </div>
    </div>
  </div>
</template>
<script>
import LabelList from './labelList.vue';
import ClusterCanvas from './clusterCanvas.vue';
import { mapMutations, mapState } from 'vuex';
import { get } from '@/api/server';
import { resultMixin } from '../../mixins/resultMixin.js';
export default {
  data () {
    return {
      modelList: [],
      modelMap: {},
      scrollHeight: null,
      outHeight: null
    };
  },
  mixins: [resultMixin],
  props: {
    group: {
      type: [Number, String]
    },
    isDownload: {
      type: String
    }
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('result', ['clusterFea', 'outputItem']),
    outContainerStyle () {
      return {
        width: '100%',
        height: '100%'
      };
    }
  },
  watch: {
    clusterFea: {
      handler (obj) {
        if (!obj.feature_name) return;
        this.getXray();
      },
      deep: true
    },
    outputItem: {
      handler (object) {
        this.setClusterFea({});
        this.setXrayObj({});
        this.setSelectLabel({});
        this.createModelMap();
        this.$refs.chartRef.getDrawData();
      },
      deep: true
    },
    isDownload: {
      handler (string) {
        if (string === 'data') {
          this.downloadData('clustering2d');
        } else if (string === 'image') {
          let dom = document.querySelector('.info-body .group-list');
          if (!dom) return;
          let outDom = this.$refs.clusterContainer;
          this.outHeight = outDom.offsetHeight;
          this.scrollHeight = dom.scrollHeight;
          document.querySelector('.cluster-container').style.height = `${this.scrollHeight}px`;
          document.querySelector('.info-body').style.height = `${this.outHeight}px`;
          document.querySelector('.group-list').style.overflow = 'visible';
          let size = {
            width: this.$el.clientWidth,
            height: this.scrollHeight
          };
          this.saveImage(size, '#clusterChart');
          document.querySelector('.cluster-container').style.height = '100%';
          document.querySelector('.info-body').style.height = 'calc(100% - 100px)';
          document.querySelector('.group-list').style.overflow = 'auto';
        }
      },
      deep: true
    }
  },
  components: {
    LabelList,
    ClusterCanvas
  },
  beforeDestroy () {
    this.setXrayObj({});
  },
  mounted () {
    this.getClusteringScore();
  },
  methods: {
    ...mapMutations('result', ['setClusterFea', 'setXrayObj', 'setSelectLabel']),
    backAllHandler () {
      this.setClusterFea({});
      this.setXrayObj({});
      this.setSelectLabel({});
      this.$refs.chartRef.drawCanvas();
    },
    async getXray () {
      let param = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        sampling: this.outputItem.sampling,
        feature_idx: this.clusterFea.feature_idx
      };
      let res = await get('clusteringXray', param);
      res = Object.assign({
        feature_name: this.clusterFea.feature_name
      }, res);
      this.setXrayObj(res);
    },
    async getClusteringScore () {
      let param = {
        project_id: this.projectId
      };
      let res = await get('clusteringScore', param);
      this.modelList = res.model_list;
      this.createModelMap();
    },
    createModelMap () {
      let list = this.modelList.filter(item => item.model_id === this.outputItem.model_id);
      this.modelMap = {};
      for (let i = 0; i < list.length; i++) {
        this.modelMap[list[i].metric] = list[i].validation_score;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.chart-info {
  flex: 1;
  width: 0;
  height: 100%;
  padding: 0px 16px;
  .info-header{
    height: 80px;
  }
  .info {
    height: 50px;
    line-height: 50px;
    > span {
      color: #F6B421;
      display: inline-block;
      margin-right: 50px;
      &:last-child {
        margin-right: 0px;
      }
    }
  }
  .tip {
    position: relative;
    height: 30px;
    line-height: 30px;
  }
  .tip-txt {
    color: #A4A4A4;
    font-size: 12px;
  }
  .tip-btn {
    color: #F6B421;
    cursor: pointer;
    text-decoration: underline;
    right: 100px;
    position: absolute;
  }
  .info-body {
    display: flex;
    height: calc(100% - 100px);
  }
}
</style>
