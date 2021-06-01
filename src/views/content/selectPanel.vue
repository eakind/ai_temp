<template>
  <div class="select-panel">
    <div class="tips">请选择一个目标</div>
    <search-input class="search-box" @change="changekeyWord" :inputValue='keyWord'></search-input>
    <scroll-list class="scroll-list" @loadMore="loadMore">
      <div class="list" v-for="(item, index) in list" :key="index"
        @click="selectFeature(item)"
        v-tooltip="toolTipObj(item)"
        :class="[targetActive(item)]">
        {{ item.feature_name }}
      </div>
    </scroll-list>
  </div>
</template>
<script>
import SearchInput from '@/components/searchInput/index.vue';
import ScrollList from '@/components/scrollList/index.vue';
import { mapMutations, mapState } from 'vuex';
// import { setTarget } from './mixins/setTarget.js';
export default {
  data () {
    return {
      keyWord: '',
      selectIndex: 0,
      tempTarget: null
    };
  },
  // mixins: [setTarget],
  components: {
    SearchInput,
    ScrollList
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('content', ['targetFeature', 'selectedFeature'])
  },
  props: {
    list: {
      type: Array
    },
    panelType: {
      type: String,
      default: 'target'
    }
  },
  methods: {
    ...mapMutations('content', ['setTargetFeature', 'setMetricsList', 'setMetricsSelect', 'setSelectedFeature']),
    selectFeature (item) {
      if (this.panelType === 'select') {
        if (this.targetFeature && this.targetFeature.feature_idx === item.feature_idx) {
          this.$message({
            message: '选择特征不能与目标特征相同。',
            type: 'warning'
          });
          return;
        }
        this.setSelectedFeature(item);
        this.$emit('select-selected', item);
      } else if (this.panelType === 'target') {
        // if (this.selectedFeature && this.selectedFeature.feature_idx === item.feature_idx) {
        //   this.$message({
        //     message: '目标特征不能与处理特征相同',
        //     type: 'warning'
        //   });
        //   return;
        // }
        this.$emit('select-target', item);
      }
    },
    // async postTargetModel (item) {
    //   let params = {
    //     project_id: this.projectId,
    //     target_feature_idx: item.feature_idx
    //   };
    //   let res = await post('postTargetModel', params);
    //   if (res.code === 0) {
    //     this.getTargetChartData();
    //     let list = res.metrics_list;
    //     let arr = [];
    //     for (let i = 0; i < list.length; i++) {
    //       arr.push({
    //         name: list[i].metric_name,
    //         value: list[i].metric_code
    //       });
    //       if (list[i].metric_code === res.optimize_metric) {
    //         this.setMetricsSelect(list[i].metric_name);
    //       }
    //     }
    //     this.setMetricsList(arr);
    //     if (this.targetFeature.feature_idx === this.selectTarget.feature_idx) {
    //     }
    //   } else {
    //     this.setTargetFeature(this.tempTarget);
    //   }
    // },
    targetActive (item) {
      if (this.panelType === 'target') {
        if (!this.targetFeature) return '';
        if (this.targetFeature.feature_idx === item.feature_idx) {
          return 'active';
        }
        return '';
      } else if (this.panelType === 'select') {
        if (!this.selectedFeature) return '';
        if (this.selectedFeature.feature_idx === item.feature_idx) {
          return 'active';
        }
        return '';
      }
    },
    toolTipObj (item) {
      let isHtml = `<div class="tooltip-title">数值类型：${item.data_type}</div>
                    <div class="tooltip-row">维数：${item.unique_num}</div>
                    <div class="tooltip-row">缺失：${item.missing_num}</div>
                    <div class="tooltip-row">平均值：${item.mean_value}</div>
                    <div class="tooltip-row">中位数：${item.median_value}</div>
                    <div class="tooltip-row">众数：${item.mode_value}</div>
                    <div class="tooltip-row">最小值：${item.min_value}</div>
                    <div class="tooltip-row">最大值：${item.max_value}</div>`;
      return {
        isHtml
      };
    },
    changekeyWord (val) {
      this.$emit('change-keyWord', val);
    },
    loadMore () {
      this.$emit('load-more');
    }
  }
};
</script>
<style lang='scss' scoped>
.select-panel {
  padding: 8px;
  width: 240px;
  max-height: 380px;
  min-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  background: #2b2b2b;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
  text-align: left;
  box-sizing: border-box;
  z-index: 1;
  @include scrollBar(#666666, 5px);
  .tips {
    line-height: 18px;
    color: #A4A4A4;
    font-size: 12px;
    margin-bottom: 8px;
  }
  .search-box {
    width: 100%;
  }
  .list {
    line-height: 32px;
    width: calc(100% -16px);
    border-radius: 4px;
    background: #333333;
    padding: 0px 8px;
    margin-top: 8px;
    &:hover {
      border: 1px solid #2193F6;
    }
  }
  .active {
    border: 1px solid #F6B421;
    color: #F6B421;
  }
}
</style>
