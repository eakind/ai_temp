<template>
  <div class="model-analysis">
    <div class="tips" v-if="analyseStatus!=='analysed'">模型剖析需要一定时间。点击“开始分析”后将统一生成所有特征分析结果。</div>
    <div class="analysis-btn" v-if="analyseStatus=== 'begin'" @click="startAnalyse">开始分析</div>
    <div class="loading-box" v-if="analyseStatus==='analysing'">
      <div class="content">
        <img src="@/assets/loading.gif" width="80">
        <span class="loading-tip">数据处理中，请稍候</span>
        <div class="tips">处理结果请稍后手动刷新页面查看。任务进度请点击“任务进程”查看。</div>
      </div>
    </div>
    <div class="analysis-result" v-if="analyseStatus==='analysed'">
      <div class="analysis-left">
        <div class="title">切换特征查看</div>
          <search-input class="search-input" inputTip="输入特征名称搜索"  @change="changekeyWord" :inputValue='keyWord'></search-input>
          <scroll-list class="feature-list" @loadMore="loadMore">
            <div class="feature-item" :class="selectIndex === index ? 'item-active' : ''"
                v-for="(item, index) in list" :key="index" @click="selectHandler(item, index)"
                v-tooltip="toolTipObj(item)">
              {{item.feature_name}}
            </div>
          </scroll-list>
      </div>
      <div class="analysis-right">
        <div class="header">
          <chart-legend class="legend" title-txt="实际值"></chart-legend>
          <chart-legend class="legend" title-txt="预测值"></chart-legend>
        </div>
        <div class="chart" ref="chart"></div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchInput from '@/components/searchInput/index.vue';
import ScrollList from '@/components/scrollList/index.vue';
import ChartLegend from './chartLegend.vue';
import { mapState } from 'vuex';
import { chartMixin } from '../mixins/chartMixin.js';
import { getFeatureList } from '../mixins/getFeatureList.js';
import { createWs } from '@/mixins/createWs.js';
import { get } from '@/api/server';
export default {
  data () {
    return {
      analyseStatus: '',
      keyWord: '',
      selectIndex: -1,
      list: [],
      jobId: '',
      targetData: []
    };
  },
  mixins: [chartMixin, getFeatureList, createWs],
  components: {
    SearchInput,
    ScrollList,
    ChartLegend
  },
  props: {
    group: {
      type: Number
    },
    isDownload: {
      type: String
    },
    showMissing: {
      type: Boolean
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
    list: {
      handler (list) {
        if (list.length > 0 && this.selectIndex === -1) {
          this.selectIndex = 0;
          this.xrayStatus();
        }
        // if (this.timer) {
        //   clearTimeout(this.timer);
        //   this.timer = null;
        // }
        // this.timer = setTimeout(() => {
        //   this.xray(true);
        // }, 500);
      },
      deep: true
    },
    outputItem: {
      handler () {
        this.xrayStatus();
      },
      deep: true
    },
    isDownload (val) {
      let size = {};
      switch (val) {
        case 'data':
          this.downloadData('xray');
          break;
        case 'image':
          size = {
            width: this.$el.clientWidth,
            height: this.$el.clientHeight
          };
          this.saveImage(size, '#analysisId');
          break;
      }
    },
    group (val) {
      if (!this.group) return;
      setTimeout(() => {
        this.createChart(this.group);
      }, 0);
    },
    showMissing (val) {
      setTimeout(() => {
        this.createChart(this.group);
      }, 0);
    },
    dataSource () {
      // if (this.timer) {
      //   clearTimeout(this.timer);
      //   this.timer = null;
      // }
      // this.timer = setTimeout(() => {
      //   this.xray();
      // }, 500);
    }
  },
  mounted () {
    this.initChart();
    this.getFeatureList();
  },
  methods: {
    initChart () {
      this.$set(this.chartObj, 'bindto', '#analysis');
      this.$set(this.chartObj, 'type', 'category');
      let combined = [];
      let barCombined = JSON.parse(JSON.stringify(this.barCombined));
      barCombined.name = 'frequency';
      barCombined.tooltip = {
        range: 'Range',
        title: '',
        value: 'frequency'
      };
      this.$set(barCombined.style, 'fill', '#2193F6');
      let lineCombined1 = JSON.parse(JSON.stringify(this.lineCombined));
      lineCombined1.name = 'actual';
      lineCombined1.style.stroke.color = '#FCF8DF';
      lineCombined1.style.point.type = 'cross';
      lineCombined1.style.point.color = 'rgba(252,248,223,1)';
      lineCombined1.tooltip = {
        title: '',
        value: 'actual',
        range: 'Range'
      };
      let lineCombined2 = JSON.parse(JSON.stringify(this.lineCombined));
      lineCombined2.name = 'predict';
      lineCombined2.style.stroke.color = '#F6B421';
      lineCombined2.style.point.type = 'circle';
      lineCombined2.style.point.color = 'rgba(246,180,33,1)';
      lineCombined2.tooltip = {
        title: '',
        value: 'predict',
        range: 'Range'
      };
      combined.push(barCombined, lineCombined2, lineCombined1);
      this.$set(this.chartObj, 'combined', combined);
    },
    setChart (width, height, data, name, range, index) {
      this.$set(this.chartObj, 'data', data);
      this.$set(this.chartObj.x, 'name', name);
      this.$set(this.chartObj.size, 'width', width);
      this.$set(this.chartObj.size, 'height', height);

      let combined = this.chartObj.combined;
      if (data.length >= index) {
        let show = Math.floor((width - 120) / 80);
        this.$set(this.chartObj.x.axis, 'hide', Math.ceil(index / show));
      }
      this.$set(combined[0].tooltip, 'range', range);
      this.$set(combined[1].tooltip, 'range', range);
      this.$set(combined[2].tooltip, 'range', range);
      let barW = Math.floor(width / (data.length * 1.8));
      this.$set(combined[0].style, 'band', barW);
    },
    createChart (index) {
      let dom = this.$refs.chart;
      if (!this.targetData.length) return;
      let [data, name, range] = this.setData(this.targetData, index);
      data = this.setLackData(data);
      let width = dom.clientWidth;
      let height = dom.clientHeight;
      this.setChart(width, height, data, name, range, index);
      this.appendChart(dom);
    },
    setData (list, index) {
      let dataObj = list[0];
      let data = [];
      let name = '';
      let range = '';
      // eslint-disable-next-line no-prototype-builtins
      if (dataObj.hasOwnProperty('left')) {
        name = 'left';
        range = 'Range';
        data = this.hasLeft(list, index);
      } else {
        name = 'value';
        range = 'value';
        data = this.hasValue(list, index);
      }
      return [data, name, range];
    },
    hasLeft (data, index) {
      let group = Math.floor(data.length / index);
      let arr = [];
      for (let i = 0; i < index; i++) {
        if (!data[i * group]) break;
        let obj = {
          left: +data[i * group].left,
          Range: `[${data[i * group].left}, ${data[i * group + group - 1].right})`
        };
        let actualGroup = '';
        let predictGroup = '';
        let frequencyGroup = '';
        let actualFre = '';
        let predictFre = '';
        if (!data[i * group].left || !data[i * group].right) {
          if (this.showMissing) {
            arr.push({
              actual: +data[i * group].actual,
              predict: +data[i * group].predict,
              frequency: +data[i * group].frequency,
              left: this.$t('missingNum'),
              Range: this.$t('missingNum')
            });
          } else {
            continue;
          }
        }
        for (let j = 0; j < group; j++) {
          if (!data[i * group + group - 1].right) continue;
          let actual = data[i * group + j].actual;
          let frequency = data[i * group + j].frequency;
          let predict = data[i * group + j].predict;
          if (predict !== '' && frequency !== '') {
            if (predictGroup === '') {
              predictGroup = 0;
              predictFre = 0;
            }
            predictGroup += Number(predict) * Number(frequency);
            predictFre += Number(frequency);
          }
          if (actual !== '' && frequency !== '') {
            if (actualGroup === '') {
              actualGroup = 0;
              actualFre = 0;
            }
            actualGroup += Number(actual) * Number(frequency);
            actualFre += Number(frequency);
          }
          if (frequency !== '') {
            if (frequencyGroup === '') frequencyGroup = 0;
            frequencyGroup += Number(frequency);
          }
        }
        if (frequencyGroup !== '' && frequencyGroup !== 0) {
          obj.actual = actualGroup === '' ? actualGroup : +(actualGroup / actualFre).toFixed(3);
          obj.predict = predictGroup === '' ? predictGroup : +(predictGroup / predictFre).toFixed(3);
          obj.frequency = +(frequencyGroup).toFixed(3);
        } else {
          obj.actual = actualGroup;
          obj.predict = predictGroup;
          obj.frequency = frequencyGroup;
        }
        if (obj.actual === '' && obj.predict === '') {
          continue;
        }
        arr.push(obj);
      }
      if (this.showMissing) {
        let len = data.length - 1;
        if (!data[len].left || !data[len].right) {
          arr.push({
            actual: data[len].actual,
            predict: data[len].predict,
            frequency: data[len].frequency,
            left: this.$t('missingNum'),
            Range: this.$t('missingNum')
          });
        }
      }
      return arr;
    },
    hasValue (data, index) {
      let arr = [];
      for (let i = 0; i < index; i++) {
        if (!data[i]) break;
        if (!data[i].frequency) break;
        if (data[i].value === '') {
          if (this.showMissing) {
            arr.push({
              frequency: +data[i].frequency,
              predict: +data[i].predict,
              value: this.$t('missingNum'),
              actual: +data[i].actual
            });
          } else {
            continue;
          }
        } else {
          arr.push({
            frequency: +data[i].frequency,
            predict: +data[i].predict,
            value: data[i].value,
            actual: +data[i].actual
          });
        }
      }
      return arr;
    },
    setLackData (arr) {
      let list = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].actual === '') {
          arr[i].noTip = 'actual';
          let [pre, preNum] = this.setPreNum(arr, i, 'actual');
          let [next, nextNum] = this.setNextNum(arr, i, 'actual');
          arr[i].actual = pre + ((next - pre) / (preNum + nextNum)) * preNum;
        }
        if (arr[i].predict === '') {
          arr[i].noTip = 'predict';
          let [pre, preNum] = this.setPreNum(arr, i, 'predict');
          let [next, nextNum] = this.setNextNum(arr, i, 'predict');
          arr[i].predict = pre + ((next - pre) / (preNum + nextNum)) * preNum;
        }
        if ((arr[i].predict || arr[i].predict === 0) && (arr[i].actual || arr[i].actual === 0)) {
          list.push(arr[i]);
        }
      }
      list = this.setBeginDraw(list, 0);
      list = this.setEndDraw(list, list.length - 1);
      return list;
    },
    setEndDraw (list, index) {
      if (!list.length) return [];
      if (!list[index].noTip) {
        return list;
      } else {
        list[index].noDraw = list[index].noTip;
        return this.setEndDraw(list, --index);
      }
    },
    setBeginDraw (list, index) {
      if (!list.length) return [];
      if (!list[index].noTip) {
        return list;
      } else {
        list[index].noDraw = list[index].noTip;
        return this.setBeginDraw(list, ++index);
      }
    },
    async xray (flag) {
      if (this.selectIndex === -1) return;
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        feature_idx: this.list[this.selectIndex].feature_idx,
        sampling: this.outputItem.sampling
      };
      this.createWs();
      let res = await get('xray', params);
      if (res.code === 0) {
        this.jobId = res.job_id;
        if (flag) {
          this.analyseStatus = 'begin';
          return;
        }
        this.analyseStatus = 'analysing';
        if (this.$refs.chart) {
          this.$refs.chart.innerHTML = '';
        }
        this.createWs();
        this.targetData = [];
        setTimeout(() => {
          this.createChart(0);
        }, 0);
        return;
      }
      if (res.code) {
        this.$message({
          message: this.$t(res.code),
          type: 'warning'
        });
        if (this.$refs.chart) {
          this.analyseStatus = 'begin';
          this.$refs.chart.innerHTML = '';
        }
        return;
      }
      this.analyseStatus = 'analysed';
      // eslint-disable-next-line no-undef
      let data = d3.csvParse(res, (d) => d);
      this.targetData = data;
      // eslint-disable-next-line no-prototype-builtins
      if (data[0].hasOwnProperty('value')) {
        this.$emit('setGroupCat', data.length);
      } else {
        this.$emit('setGroup', data.length);
      }
    },
    createWs () {
      this.initWs();
      window.ws.onmessage = (event) => {
        console.log(JSON.parse(event.data));
        if (!event.data) return;
        let data = JSON.parse(event.data);
        let msgType = data.msg_type;
        let jobType = data.job_type;
        if (msgType === 'active_done' && jobType === 'xray') {
          this.xray();
        }
      };
    },
    async xrayStatus () {
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        sampling: this.outputItem.sampling
      };
      this.analyseStatus = 'begin';
      let res = await get('xrayStatus', params);
      if (res.code === 0) {
        switch (res.xray_status) {
          case 'PENDING':
            this.analyseStatus = 'begin';
            break;
          case 'SUCCEED':
            this.analyseStatus = 'analysed';
            this.xray();
            break;
          default:
            this.analyseStatus = 'begin';
            break;
        }
      }
    },
    startAnalyse () {
      this.analyseStatus = 'analysing';
      this.xray();
    },
    selectHandler (item, index) {
      this.selectIndex = index;
      this.$emit('changeIndex');
      if (this.analyseStatus === 'analysed') {
        this.xray(true);
      }
    },
    toolTipObj (item) {
      let isHtml = `<div class="tooltip-title">${item.feature_name}</div>
                    <div class="tooltip-row">数值类型: ${item.data_type}</div>
                    <div class="tooltip-row">维数: ${item.unique_num}</div>
                    <div class="tooltip-row">缺失: ${item.missing_num}</div>
                    <div class="tooltip-row">平均值: ${item.mean_value}</div>
                    <div class="tooltip-row">中位数: ${item.median_value}</div>
                    <div class="tooltip-row">众数: ${item.mode_value}</div>                    
                    <div class="tooltip-row">最小值: ${item.min_value}</div>
                    <div class="tooltip-row">最大值: ${item.max_value}</div>`;
      return {
        isHtml
      };
    }
  }
};
</script>
<style lang='scss' scoped>
.model-analysis {
  height: 100%;
  width: 100%;
  .tips {
    color: #A4A4A4;
    font-size: 12px;
    margin: 18px 0px 24px 0px;
  }
  .analysis-btn {
    width: 80px;
    height: 28px;
    line-height: 28px;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    background: linear-gradient(180deg, #89F7FE 0%, #66A6FF 100%);
  }
  .loading-box {
    height: calc(100% - 300px);
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content {
    width: 500px;
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .loading-tip {
      margin-top: 10px;
    }
  }
  .analysis-result {
    display: flex;
    height: 100%;
    width: 100%;
    .analysis-left {
      height: 100%;
      width: 272px;
      padding: 0px 16px;
      box-sizing: border-box;
      border-radius: 4px;
      background: #222222;
      border: 1px solid #424242;
      .title {
        margin-top: 8px;
        font-size: 12px;
        color: #FCF8DF;
        line-height: 24px;
      }
      .search-input {
        width: 100%;
        background: none;
        border-radius: 0px;
        border-bottom: 1px solid #FCF8DF;
      }
      .feature-list {
        height: calc(100% - 80px);
        .feature-item {
          height: 32px;
          line-height: 32px;
          padding: 0px 8px;
          box-sizing: border-box;
          border-radius: 4px;
          background: #333333;
          cursor: pointer;
          margin-top: 16px;
        }
        .item-active {
          border: 1px solid #F6B421;
        }
      }
    }
    .analysis-right {
      flex: 1;
      width: 0;
      height: 100%;
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
    }
  }
}
</style>
