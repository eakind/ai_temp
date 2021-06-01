<template>
  <div class="residual-analysis">
    <div class="top-panel">
      <div class="left">
        <div class="title">残差独立性</div>
      </div>
      <div class="middle info">
        <span>因变量Y：featureName</span>
        <span>均值=0.01</span>
        <span>标准差=0.985</span>
        <span>N=155</span>
      </div>
      <div class="residual-chart"></div>
    </div>
    <div class="bottom-panel">
      <div class="left">
        <div class="title">残差方差齐性</div>
        <div class="fea-panel">
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
      </div>
      <div class="middle"></div>
      <div class="chart"></div>
    </div>
  </div>
</template>
<script>
import SearchInput from '@/components/searchInput/index.vue';
import ScrollList from '@/components/scrollList/index.vue';
import { getFeatureList } from '../mixins/getFeatureList.js';
export default {
  data () {
    return {
      keyWord: '',
      selectIndex: -1,
      list: []
    };
  },
  mixins: [getFeatureList],
  components: {
    SearchInput,
    ScrollList
  },
  mounted () {
    this.getFeatureList();
  },
  methods: {
    loadMore () {},
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
.residual-analysis {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  .top-panel {
    height: 290px;
    width: 100%;
    border-bottom: 1px solid #424242;
    display: flex;
  }
  .left {
    width: 272px;
    height: 100%;
  }
  .middle {
    width: 240px;
    margin: 0px 16px;
    height: 100%;
  }
  .info {
    >span {
      display: block;
      line-height: 32px;
      width: 100%;
      @include ellipsis;
    }
  }
  .residual-chart {
    flex: 1;
    width: 0;
    height: 100%;
  }
  .title {
    line-height: 32px;
    position: relative;
    &::after {
      content: '';
      height: 1px;
      width: 52px;
      background: #F6B421;
      display: inline-block;
      position: absolute;
      left: 0px;
      bottom: 0px;
    }
  }
  .fea-panel{
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
}
</style>
