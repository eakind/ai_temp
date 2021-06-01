<template>
  <div class="binning-info">
    <div class="title">特征名称：featurename</div>
    <div class="title">分箱算法：无监督分箱 <span class="margin-style">等频</span></div>
    <div class="title">详细数据</div>
    <feature-table :headerTitle="headerTitle" :tableData="tableData" :headerArr="headerArr" type="binning"></feature-table>
  </div>
</template>
<script>
import FeatureTable from '../../content/contentView/featureTable.vue';
import { mapState } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      headerTitle: [],
      tableData: [],
      headerArr: []
    };
  },
  components: {
    FeatureTable
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('content', ['selectedBinning'])
  },
  beforeDestroy () {
    this.selectedBinning(null);
  },
  mounted () {
    if (this.selectedBinning && this.selectedBinning.origin_data_type === 'STRING') {
      this.binningString();
    } else if (this.selectedBinning && this.selectedBinning.origin_data_type === 'NUMBER') {
      this.binningNumerical();
    }
  },
  methods: {
    async binningString (temp) {
      let params = {
        project_id: this.projectId,
        feature_idx: this.selectedBinning.feature_idx,
        tmp: temp
      };
      let res = await get('binningString', params);
      if (res.code === 0) {
        this.headerTitle = res.data.columns;
        this.headerArr = res.data.columns;
        this.tableData = res.data.binning_result;
      }
    },
    async binningNumerical (temp) {
      let params = {
        project_id: this.projectId,
        feature_idx: this.selectedBinning.feature_idx,
        tmp: temp
      };
      let res = await get('binningNumerical', params);
      if (res.code === 0) {
        this.headerTitle = res.data.columns;
        this.headerArr = res.data.columns;
        this.tableData = res.data.binning_result;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.binning-info {
  background: #2B2B2B;
  padding: 16px;
  color: #fff;
  font-size: 14px;
  margin-top: 10px;
  .title {
    line-height: 30px;
  }
  .margin-style {
    margin-left: 50px;
  }
}
</style>
