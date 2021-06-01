<template>
  <div class="processing-feature">
    <div class="choose-box">
      <div class="title">处理特征</div>
      <div class="select-box" :class="featureFlag? 'active' : ''" v-click-out="hide" @click="featureFlag=true">
        选择
        <span class="iconfont icon-db_arrow"></span>
        <select-panel class="select-panel" panelType="select" :list="list"  @load-more="loadMore" v-if="featureFlag" @select-selected="featureFlag=false"></select-panel>
      </div>
    </div>
    <div class="chart-box">
      <div class="left">
        <div class="choose-box margin-style">
          <div class="feature-name" v-if="selectedFeature">{{ selectedFeature.feature_name }}</div>
          <drop-list :list="numList" select="20" class="drop-list" @on-change="changeNum"></drop-list>
        </div>
        <div class="chart" ref="sChart"></div>
      </div>
      <div class="right">
        <div class="list" v-for="(item, sIdx) in titleList" :key="sIdx">
          <span>{{ item }}</span>
          <span v-if="selectedFeature">{{ selectedFeature[valueList[sIdx]] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SelectPanel from '../selectPanel.vue';
import DropList from '@/components/dropList/index.vue';
import { mapState } from 'vuex';
import { selectedData } from '../mixins/selectedData.js';
import { getFeatureList } from '../mixins/getFeatureList.js';
export default {
  data () {
    return {
      featureFlag: false,
      numList: [],
      titleList: ['数据来源', '数据类型', '维数', '缺失', '平均值', '众数', '最大值', '最小值',
        '丢失', '缺失率', '标准差', '25%分位', '50%分位', '75%分位', '皮尔相关系数', '卡方值(P)'],
      valueList: ['status', 'data_type', 'unique_num', 'missing_num', 'mean_value',
        'mode_value', 'max_value', 'min_value', 'min_value', 'min_value', 'min_value',
        'min_value', 'min_value', 'min_value', 'min_value', 'min_value'],
      list: []
    };
  },
  components: {
    SelectPanel,
    DropList
  },
  mixins: [selectedData, getFeatureList],
  watch: {
    list: {
      handler (arr) {
        if (!this.selectedFeature && arr.length) {
          this.setSelectedFeature(arr[0]);
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('content', ['selectedFeature', 'targetFeature'])
  },
  mounted () {
    this.getFeatureList();
  },
  methods: {
    hide () {
      this.featureFlag = false;
    }
  }
};
</script>
<style lang='scss' scoped>
.processing-feature {
  height: 100%;
  width: 100%;
  padding: 0px 12px;
  .chart-box {
    display: flex;
    align-items: center;
    .left {
      flex: 1;
    }
    .right {
      margin-left: 24px;
      width: 192px;
      height: 212px;
      overflow-y: auto;
      overflow-x: hidden;
      background: #222;
      border-radius: 4px;
      @include scrollBar(#a4a4a4, 5px);
      box-shadow: inset -4px -4px 4px 0px rgba($color: #646464, $alpha: 0.4),inset 4px 4px 8px 0px rgba($color: #646464, $alpha: 0.4);
      .list {
        width: calc(100% - 40px);
        position: relative;
        height: 32px;
        line-height: 32px;
        padding: 0px 32px;
        padding-right: 8px;
        &:nth-child(even) {
          border: none;
        }
        >span:nth-child(1) {
          display: inline-block;
          width: 84px;
          &::before {
            content: '';
            height: 4px;
            width: 4px;
            border-radius: 50%;
            position: absolute;
            background: #F6B421;
            left: 16px;
            top: 14px;
          }
        }
        >span:nth-child(2){
          color: #FCF8DF;
          @include ellipsis;
        }
      }
    }
  }
  .choose-box {
    display: flex;
    align-items: center;
    .title {
      margin-right: 8px;
      line-height: 32px;
      width: 160px;
      padding-left: 24px;
      border-radius: 4px;
      background: #333333;
      position: relative;
      &::before {
        content: '';
        border-radius: 4px;
        height: 4px;
        width: 16px;
        top: 14px;
        left: 0px;
        position: absolute;
        background: #F6B421;
      }
    }
    .drop-list {
      width: 120px;
      height: 32px;
    }
    .feature-name {
      flex: 1;
      color: white;
      background: linear-gradient(0deg, #EDDE5D 0%, #F09819 100%);
      background-clip: text;
      color: transparent;
      font-weight: bold;
    }
  }
  .margin-style {
    margin: 18px 0px;
  }
  .select-box {
    height: 32px;
    line-height: 32px;
    width: 80px;
    text-align: center;
    border-radius: 4px;
    background: #2B2B2B;
    border: 1px solid #444444;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    >span {
      color: #F6B421;
      padding-left: 8px;
    }
    .select-panel {
      position: absolute;
      left: 85px;
      top: 0px;
    }
  }
  .chart {
    width: 100%;
    height: 200px;
  }
}
</style>
