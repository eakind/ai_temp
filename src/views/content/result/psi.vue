<template>
  <div class="psi">
    <div class="tips" v-if="psiStatus!=='analysed'">计算需要一定时间，请点击“开始分析”生成任务。</div>
    <div class="analysis-btn" v-if="psiStatus=== 'begin'" @click="startAnalyse">开始分析</div>
    <div class="loading-box" v-if="psiStatus==='analysing'">
      <div class="content">
        <img src="@/assets/loading.gif" width="80">
        <span class="loading-tip">数据处理中，请稍候</span>
        <div class="tips">处理结果请稍后手动刷新页面查看。任务进度请点击“任务进程”查看。</div>
      </div>
    </div>
    <div class="analysis-result" v-if="psiStatus==='analysed'">
      <div class="analysis-left">
        <div class="title">切换特征查看</div>
          <search-input class="search-input" inputTip="输入特征名称搜索"  @change="changekeyWord" :inputValue='keyWord'></search-input>
          <scroll-list class="feature-list" @loadMore="loadMore">
            <div class="feature-item" :class="selectIndex === index ? 'item-active' : ''"
                v-for="(item, index) in list" :key="index" @click="selectHandler(item, index)">
              {{item.feature_name}}
            </div>
          </scroll-list>
      </div>
      <div class="analysis-right">
        <div class="header" v-if="targetData.length">
          <div class="value" v-if="psiDetail">当前PSI：{{psiDetail}}</div>
          <chart-legend class="legend" title-txt="PSI"></chart-legend>
          <div class="bars-legend">实际值</div>
          <div class="legend-style">预测值</div>
        </div>
        <div class="chart" ref="psiChart" id="psiChart"></div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts';
import SearchInput from '@/components/searchInput/index.vue';
import ScrollList from '@/components/scrollList/index.vue';
import ChartLegend from './chartLegend.vue';
import { mapState } from 'vuex';
import { getFeatureList } from '../mixins/getFeatureList.js';
import { resultMixin } from '../mixins/resultMixin.js';
import { createWs } from '@/mixins/createWs.js';
import { get } from '@/api/server';
require('echarts/theme/macarons');
export default {
  data () {
    return {
      psiChart: null,
      psiStatus: '',
      keyWord: '',
      selectIndex: -1,
      list: [],
      psiDetail: null,
      jobId: '',
      targetData: [],
      chartDataList: null
    };
  },
  mixins: [getFeatureList, createWs, resultMixin],
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
    dataSet: {
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
          this.getPsiStatus();
        }
      },
      deep: true
    },
    outputItem: {
      handler () {
        this.getPsiStatus();
      },
      deep: true,
      immediate: true
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
          this.saveImage(size, '#psiChart');
          break;
      }
    },
    group (val) {
      if (!this.group) return;
      setTimeout(() => {
        this.getPsiStatus();
      }, 0);
    },
    showMissing (val) {
      setTimeout(() => {
        this.getPsiStatus();
      }, 0);
    },
    dataSet () {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.psi(true);
      }, 500);
    },
    targetData: {
      handler (item) {
        console.log(item);
        if (item && item.length > 0) {
          this.$nextTick(() => {
            this.drawChart(this.chartDataList);
          });
        }
      },
      deep: true
    }
  },
  mounted () {
    this.getPsiFeatureList();
  },
  methods: {
    drawChart (list) {
      if (this.psiChart) {
        this.psiChart.dispose();
      }
      this.psiChart = echarts.init(this.$refs.psiChart);
      console.log(this.psiChart);
      var option;
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        xAxis: [{
          type: 'category',
          data: list.index,
          // axisPointer: {
          //   type: 'shadow'
          // },
          axisLabel: {
            textStyle: {
              color: '#FCF8DF',
              fontSize: 14
            }
          },
          axisLine: {
            lineStyle: {
              color: '#FACC14'
            }
          }
        }],
        yAxis: [{
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#FACC14'
            }
          },
          lineStyle: {
            color: '#F6B421'
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(66, 66, 66, 0.5)'
            }
          },
          name: '',
          min: 0,
          max: list.max,
          interval: list.max / 10,
          axisLabel: {
            textStyle: {
              color: '#FCF8DF',
              fontSize: 14
            },
            formatter: '{value}'
          }
        }, {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#FACC14'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(66, 66, 66, 0.5)'
            }
          },
          name: '',
          min: 0,
          max: list.psiMax,
          interval: list.psiMax / 10,
          axisLabel: {
            textStyle: {
              color: '#FCF8DF',
              fontSize: 14
            },
            formatter: '{value}'
          }
        }],
        series: [{
          name: '预测值',
          type: 'bar',
          barGap: '0%',
          barMaxWidth: 150,
          color: ['#8E2728'],
          data: list.baseCount
        }, {
          name: '实际值',
          type: 'bar',
          barMaxWidth: 150,
          color: ['#013F81'],
          data: list.testCount
        }, {
          name: 'psi',
          type: 'line',
          color: ['#FACC14'],
          yAxisIndex: 1,
          data: list.psi
        }]
      };
      option && this.psiChart.setOption(option);
    },
    async getPsiFeatureList () {
      this.list = [];
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        sampling: this.outputItem.sampling
      };
      let res = await get('psiFeatureList', params);
      if (res.code === 0) {
        this.list = res.feature_list;
      }
    },
    async psi (flag) {
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        sampling: this.outputItem.sampling,
        feature_name: this.list[this.selectIndex].feature_name,
        // feature_name: this.list[1].feature_name,
        n: this.group,
        dropna: this.showMissing ? 1 : 0,
        dataset: this.dataSet
      };
      if (this.$route.name !== 'result') {
        return;
      }
      if (!flag) {
        this.createWs();
      }
      let res = await get('psi', params);
      if (res.code) {
        this.$message({
          message: this.$t(res.code),
          type: 'warning'
        });
        if (this.$refs.chart) {
          this.psiStatus = 'begin';
          this.$refs.chart.innerHTML = '';
        }
        return;
      }
      if (!flag) {
        this.createWs();
      }
      this.psiStatus = 'analysed';
      this.targetData = [];
      // eslint-disable-next-line no-undef
      let data = d3.csvParse(res.data, (d) => d);
      this.psiDetail = res.psi;
      let arr = [];
      for (let key of data) {
        arr.push(key);
      }
      if (!arr.length) return;
      arr.forEach((item, index) => {
        this.targetData.push({
          baseCount: Number(item.base_count),
          index: Number(item.index),
          psi: Number(item.psi),
          testCount: Number(item.test_count),
          xIndex: Number(index + 1)
        });
      });
      console.log(this.targetData);
      this.setData(this.targetData);
    },
    setData (data) {
      let arr = {
        testCount: [],
        baseCount: [],
        psi: [],
        index: [],
        max: 0,
        psiMax: 0
      };
      for (let i in data) {
        arr.testCount.push(data[i].testCount);
        arr.baseCount.push(data[i].baseCount);
        arr.psi.push(data[i].psi);
        arr.index.push(data[i].index);
      }
      let maxArr = [];
      maxArr.push(Math.max(...arr.testCount), Math.max(...arr.baseCount));
      arr.max = this.formatInt(Math.max(...maxArr), 1, true);
      arr.psiMax = this.formatNum(Math.max(...arr.psi), 1);
      this.chartDataList = arr;
      console.log(arr);
    },
    // 取整为10的倍数
    formatInt (num, prec = 1, ceil = true) {
      const len = String(num).length;
      if (len <= prec) {
        return num;
      }
      const mult = Math.pow(10, prec);
      return ceil ? Math.ceil(num / mult) * mult : Math.floor(num / mult) * mult;
    },
    formatNum (num, n) {
      return Math.ceil(num * Math.pow(10, n)) / Math.pow(10, n);
    },
    createWs () {
      this.initWs();
      window.ws.onmessage = (event) => {
        console.log(JSON.parse(event.data));
        if (!event.data) return;
        let data = JSON.parse(event.data);
        let msgType = data.msg_type;
        let jobType = data.job_type;
        if (msgType === 'active_done' && jobType === 'psi') {
          this.psi();
        }
      };
    },
    async getPsiStatus () {
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        sampling: this.outputItem.sampling
      };
      this.psiStatus = 'begin';
      let res = await get('psiStatus', params);
      if (res.code === 0) {
        switch (res.psi_status) {
          case 'PENDING':
            this.psiStatus = 'analysing';
            break;
          case 'SUCCEED':
            this.psiStatus = 'analysed';
            this.psi(true);
            break;
          default:
            this.psiStatus = 'begin';
            break;
        }
      }
    },
    startAnalyse () {
      this.psiStatus = 'analysing';
      this.psi();
    },
    selectHandler (item, index) {
      this.selectIndex = index;
      this.$emit('changeIndex');
      if (this.psiStatus === 'analysed') {
        this.psi(true);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.psi {
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
        .value {
          line-height: 30px;
          color: #F6B421;
          padding-left: 24px;
        }
        .legend{
          line-height: 30px;
          top: 0px;
          font-size: 14px;
          position: absolute;
          &:nth-child(2){
            right: 140px;
          }
          &:nth-child(3){
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
  .bars-legend {
    position: absolute;
    color: #FCF8DF;
    right: 78px;
    top: 6px;
    display: inline-block;
    padding-left: 24px;
    width: 80px;
    &::before {
      content: '';
      display: inline-block;
      height: 16px;
      width: 16px;
      background: #013F81;
      position: absolute;
      left: 0px;
    }
  }
  .legend-style {
    position: absolute;
    color: #FCF8DF;
    padding-left: 24px;
    display: inline-block;
    right: 22px;
    top: 6px;
    &::before {
      content: '';
      display: inline-block;
      height: 16px;
      width: 16px;
      background: #8E2728;
      position: absolute;
      left: 0px;
    }
  }
}
</style>
