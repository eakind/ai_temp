<template>
  <div class="roc">
    <div class="roc-left" id="rocId">
      <div class="title">AUC={{aucNum}}</div>
      <div class="chart" ref="roc"></div>
    </div>
    <div class="roc-right">
      <div class="setting-panel">
        <div><span class="num">{{cutTxt}}：{{cutOff}}<span v-if="cutTxt === '阈值'">(自定义比例)</span></span></div>
        <div class="btn-box">
          <div class="output-btn" @click="thresholdFlag=true">
            <span class="iconfont icon-db_edit"></span>
            阈值设置
          </div>
        </div>
        <div class="btn-box" @click="settingFlag=true">
          <div class="output-btn">
            <span class="iconfont icon-db_edit"></span>
            最强准确率
          </div>
        </div>
      </div>
      <matrix-table id="matrix" :dataSource="dataSource" @setAuc="setAuc"></matrix-table>
    </div>
    <threshold v-if="thresholdFlag" :thresholdFlag="thresholdFlag" :dataSource="dataSource" @confirm="thresholdConfirm" @cancel="thresholdCancel"></threshold>
    <accuracy-setting v-if="settingFlag" :settingFlag="settingFlag" :dataSource="dataSource" @confirm="settingConfirm" @cancel="settingCancel"></accuracy-setting>
  </div>
</template>
<script>
import MatrixTable from './roc/matrixTable';
import Threshold from './roc/threshold.vue';
import AccuracySetting from './roc/accuracySetting.vue';
import { chartMixin } from '../mixins/chartMixin.js';
import { resultMixin } from '../mixins/resultMixin.js';
import { mapState } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      thresholdFlag: false,
      settingFlag: false,
      targetData: [],
      cutTxt: '默认阈值',
      aucNum: '',
      cutOff: 0.5
    };
  },
  mixins: [chartMixin, resultMixin],
  components: {
    MatrixTable,
    Threshold,
    AccuracySetting
  },
  props: {
    isDownload: {
      type: String
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
        this.roc();
      },
      deep: true,
      immediate: true
    },
    dataSource () {
      this.roc();
    },
    isDownload (val) {
      let dom = null;
      let size = {};
      switch (val) {
        case 'matrix':
          dom = this.$el.querySelector('#matrix');
          this.downloadMatrix(dom, '#matrix');
          break;
        case 'image':
          size = {
            width: this.$el.querySelector('#rocId').clientWidth,
            height: this.$el.querySelector('#rocId').clientHeight
          };
          this.saveImage(size, '#rocId');
          break;
        case 'data':
          this.downloadData('roc');
          break;
      }
    }
  },
  mounted () {
    this.initChart();
  },
  methods: {
    initChart () {
      this.$set(this.chartObj, 'bindto', '#roc');
      this.$set(this.chartObj, 'type', 'numeric');
      this.$set(this.chartObj.x, 'name', 'fpr');
      this.$set(this.chartObj.x.axis, 'format', false);
      this.$set(this.chartObj, 'divide', {
        show: true,
        color: '#FCF8DF',
        width: 2
      });
      let combined = [];
      this.$set(this.lineCombined, 'name', 'tpr');
      this.$set(this.lineCombined, 'axis', 'y');
      let style = this.lineCombined.style;
      style.stroke.color = '#2193F6';
      style.point.type = 'circle';
      style.point.color = '#2193F6';
      style.point.size = 25;
      combined.push(this.lineCombined);
      this.$set(this.chartObj, 'combined', combined);
    },
    createChart () {
      let dom = this.$refs.roc;
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
    async roc () {
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        dataset: this.dataSource,
        sampling: this.outputItem.sampling
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
      this.targetData = [];
      for (let i in data) {
        this.targetData.push({
          fpr: +data[i].fpr,
          tpr: +data[i].tpr
        });
      }
      this.createChart();
    },
    setAuc (val) {
      this.aucNum = val.toFixed(4);
    },
    thresholdConfirm (value, txt, pecent) {
      this.thresholdFlag = false;
      this.cutOff = String(value).length > 4 ? value.toFixed(4) : value;
      this.cutTxt = txt;
    },
    thresholdCancel () {
      this.thresholdFlag = false;
    },
    settingConfirm () {
      this.settingFlag = false;
    },
    settingCancel () {
      this.settingFlag = false;
    }
  }
};
</script>
<style lang='scss' scoped>
.roc {
  height: 100%;
  width: 100%;
  display: flex;
  .roc-left {
    flex: 1;
    width: 50%;
    height: 100%;
    box-sizing: border-box;
    padding: 24px;
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
  .roc-right {
    flex: 1;
    width: 50%;
    .setting-panel {
      border-bottom: 1px solid #424242;
    }
    .num {
      display: inline-block;
      height: 32px;
      line-height: 32px;
      padding: 0px 12px;
      text-align: center;
      border-radius: 4px;
      background: #333333;
      color: #FCF8DF;
      margin-bottom: 16px;
      margin-top: 24px;
    }
    .btn-box {
      .output-btn {
        padding-left: 32px;
        height: 30px;
        line-height: 30px;
        width: 88px;
        text-align: center;
        border-radius: 20px 4px 4px 20px;
        margin-bottom: 16px;
        background: linear-gradient(90deg, #333333 0%, #333333 100%);
        position: relative;
        cursor: pointer;
        .icon-db_edit {
          height: 16px;
          line-height: 16px;
          width: 30px;
          border-radius: 7px;
          font-size: 14px;
          position: absolute;
          left: 0px;
          top: 7px;
        }
        &::before {
          content: '';
          height: 30px;
          width: 30px;
          border-radius: 50%;
          position: absolute;
          background: linear-gradient(180deg, #F6B421 0%, #483F2A 30%, #483F2A 80%, #F6B421 100%);
          left: 0;
        }
      }
    }
  }
}
</style>
