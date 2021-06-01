<template>
  <div class="feature-list">
    <span class="tip-txt">选择不同特征查看特征聚类信息</span>
    <search-input class="search-input" inputTip="输入特征名称搜索"  @change="changekeyWord" :inputValue='keyWord'></search-input>
    <div class="list">
      <div
        class="list-item"
        v-for="(item, index) in feaList"
        :key="index"
        :class="clusterFea.feature_idx === item.feature_idx ? 'is-active' : ''"
        @click="selectHandler(item)"
      >
        {{ item.feature_name }}
      </div>
    </div>
  </div>
</template>
<script>
import SearchInput from '@/components/searchInput/index.vue';
import { getFeatureList } from '../../mixins/getFeatureList.js';
import { mapMutations, mapState } from 'vuex';
export default {
  data () {
    return {
      offset: 0,
      limit: 10000,
      list: []
    };
  },
  computed: {
    ...mapState('result', ['clusterFea']),
    feaList () {
      return this.list.filter(item => item.selected);
    }
  },
  mixins: [getFeatureList],
  components: {
    SearchInput
  },
  beforeDestroy () {
    this.setClusterFea({});
  },
  mounted () {
    this.offset = 0;
    this.getFeatureList();
  },
  methods: {
    ...mapMutations('result', ['setClusterFea']),
    selectHandler (item) {
      this.setClusterFea(item);
    }
  }
};
</script>
<style lang='scss' scoped>
.feature-list {
  width: 200px;
  height: 100%;
  border-radius: 2px;
  background: #222222;
  padding: 8px;
  border: 0.5px solid #424242;
  overflow-y: auto;
  overflow-x: hidden;
  .tip-txt {
    font-size: 12px;
    color: #fcf8df;
  }
  .search-input {
    width: 100%;
    background: none;
    border-radius: 0px;
    border-bottom: 1px solid #FCF8DF;
  }
  .list {
    height: calc(100 - 100px);
    overflow: auto;
  }
  .list-item {
    border-radius: 4px;
    background: #333333;
    height: 22px;
    line-height: 22px;
    padding: 4px;
    color: #ffffff;
    margin: 4px 0px;
    cursor: pointer;
    border: 1px solid #333333;
    @include ellipsis;
  }
  .is-active {
    border-radius: 4px;
    color: #F6B421;
    border: 1px solid #F6B421;
  }
}
</style>
