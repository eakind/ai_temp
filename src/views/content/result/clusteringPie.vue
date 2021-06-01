<template>
  <div class="clustering-pie" id="pie" ref="clusteringPie">
    <div class="tips">默认显示数据量前20位的类别。其他的归为others显示展示。</div>
    <div class="chart-box">
      <div class="chart" ref="chartPie"></div>
      <div class="legend-box">
        <div class="item header-item" v-for="(item, hIdx) in headerList" :key="hIdx">
          {{item}}
        </div>
        <div class="body">
          <div class="list" v-for="(list, lIdx) in legendData" :key="lIdx">
            <span>{{lIdx + 1}}</span>
            <span>
              <i class="legendIcon" :style="{backgroundColor: colorList[lIdx]}"></i>
              <span class="legendName">{{list.class}}</span>
            </span>
            <span>{{Number(list.rate*100).toFixed(2)}}%</span>
            <span>{{list.count}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts';
import { mapState } from 'vuex';
import { resultMixin } from '../mixins/resultMixin.js';
import { get } from '@/api/server';
require('echarts/theme/macarons');
export default {
  data () {
    return {
      chartPie: null,
      legendData: [],
      pieData: [],
      headerList: ['No.', '类别', '占比', '记录数'],
      colorList: [],
      timer: null,
      scrollHeight: null
    };
  },
  mixins: [resultMixin],
  props: {
    isDownload: {
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
          this.getChartData();
        }, 500);
      },
      deep: true,
      immediate: true
    },
    pieData: {
      handler (item) {
        if (item && item.length > 0) {
          this.$nextTick(() => {
            this.drawPieChart(item);
          });
        }
      },
      deep: true
    },
    isDownload (val) {
      let dom = this.$refs.clusteringPie;
      if (!dom) return;
      this.scrollHeight = dom.scrollHeight;
      let size = {};
      if (val === 'data') {
        this.downloadData('clusteringPie');
      } else if (val === 'image') {
        size = {
          width: this.$el.clientWidth,
          height: this.scrollHeight
        };
        this.saveImage(size, '#pie');
      }
    }
  },
  mounted () {
  },
  methods: {
    async getChartData () {
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        sampling: this.outputItem.sampling
      };
      let res = await get('clusteringPie', params);
      // eslint-disable-next-line no-undef
      let data = d3.csvParse(res, (d) => d);
      this.legendData = data;
      this.pieData = [];
      for (let i in data) {
        this.pieData.push({
          name: `${data[i].class}`,
          value: data[i].count
        });
      }
    },
    drawPieChart (data) {
      if (this.chartPie) {
        this.chartPie.dispose();
      }
      this.colorList = ['#FACC14', '#F5282D', '#8543E0', '#F59E28', '#DE2393', '#91BA38', '#5C9BED', '#B8D1BD', '#E7B3B3', '#7DC383',
        '#DE2393', '#EFA35C', '#8D8D8D', '#91BA38', '#C9BFE1', '#5C9BED', '#C49A9A', '#1B3764', '#C4BD9A', '#626088', 'aqua'];
      this.chartPie = echarts.init(this.$refs.chartPie);
      var option;
      option = {
        title: {
          show: false,
          text: 'Pie Chart',
          x: 'center'
        },
        tooltip: {
          show: true,
          formatter: '{b}  <br/> {d}%  <br/> {c}',
          trigger: 'item'
        },
        color: this.colorList,
        grid: {
          top: 0,
          left: 0,
          bottom: 0,
          right: '20px'
        },
        series: [
          {
            type: 'pie',
            radius: '75%',
            center: ['50%', '50%'],
            data: data,
            // label: {
            //   normal: {
            //     formatter: '{b},{d}%,{c}',
            //     textStyle: {
            //       color: '#fff'
            //     }
            //   }
            // }
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  // position: 'top',
                  // formatter: '{b} \n {d}% \n {c}',
                  formatter: '{b},{d}%,{c}',
                  labelLine: {
                    show: true
                  },
                  textStyle: {
                    color: '#fff',
                    fontSize: 10
                  }
                }
              }
            }
          }
        ]
      };
      option && this.chartPie.setOption(option);
    }
  }
};
</script>
<style lang='scss' scoped>
.clustering-pie {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding: 0px 16px;
  .tips {
    color: #A4A4A4;
    font-size: 12px;
  }
  .chart-box {
    width: 100%;
    margin-top: 12px;
    height: calc(100% - 40px);
    display: flex;
    justify-content: space-between;
    .chart {
      width: 60%;
      height: 100%;
    }
    .legend-box {
      width: 40%;
    }
    .item {
      width: 25%;
      height: 30px;
      line-height: 30px;
      display: inline-block;
      text-align: center;
    }
    .header-item {
      background: #333333;
    }
    .body {
      width: 100%;
      .list {
        width: 100%;
        height: 28px;
        line-height: 28px;
        text-align: center;
        color: #fff;
        box-sizing: border-box;
        >span{
          display: inline-block;
          box-sizing: border-box;
          height: 100%;
          width: 25%;
          background: #444444;
          border-top: 1px solid #2B2B2B;
          border-left: 1px solid #2B2B2B;
        }
        .legendIcon {
          display: inline-block;
          height: 14px;
          width: 14px;
          border-radius: 2px;
        }
        .legendName {
          display: inline-block;
          width: 55px;
          padding-left: 12px;
          text-align: left;
        }
      }
    }
  }
}
</style>
