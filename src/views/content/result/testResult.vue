<template>
  <div class="test-result">
    <div class="title">回归模型似然比检验结果</div>
    <div class="table">
      <div class="table-header list">
        <span class="item" v-for="(item, hIdx) in headerList" :key="hIdx">{{item}}</span>
      </div>
      <scroll-list class="table-body" @loadMore="loadMore">
        <div class="body-list list" v-for="(item, tIdx) in list" :key="tIdx">
          <span class="item" v-for="(childItem, cIdx) in headerArr" :key="cIdx"></span>
        </div>
      </scroll-list>
    </div>
  </div>
</template>
<script>
import ScrollList from '@/components/scrollList/index.vue';
export default {
  data () {
    return {
      headerList: ['似然比卡方值', 'df', 'p', 'AIC值', 'BIC值'],
      headerArr: ['似然比卡方值', 'df', 'p', 'AIC值', 'BIC值'],
      list: [{}, {}, {}]
    };
  },
  components: {
    ScrollList
  },
  mounted () {},
  methods: {
    loadMore () {}
  }
};
</script>
<style lang='scss' scoped>
.test-result {
  height: 100%;
  width: 100%;
  .title {
    font-size: 16px;
    color: #F6B421;
    font-weight: bold;
  }
  .table {
    height: calc(100% - 88px);
    width: 100%;
    margin-top: 12px;
    .list {
      height: 36px;
      >span {
        display: inline-block;
        font-size: 12px;
        height: 36px;
        width: calc(100% / 5);
        padding: 0px 4px;
        line-height: 36px;
        text-align: center;
        box-sizing: border-box;
        border-right: 1px solid #2B2B2B;
        border-bottom: 1px solid #2B2B2B;
        &:last-child {
          border-right: none;
        }
      }
    }
    .table-header {
      background: #333;
      >span {
        color: #FCF8DF;
        font-weight: 600;
      }
    }
    .body-list {
      background: #444444;
    }
  }
}
</style>
