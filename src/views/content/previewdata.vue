<template>
  <div class="preview-data">
    <div class="title">查看数据</div>
    <div class="tips">若项目曾进行特征工程，将会生成修改后数据。</div>
    <div class="content">
      <div class="tab-box">
        <el-tabs v-model="selectName">
          <el-tab-pane label="原始数据" name="originData">
          </el-tab-pane>
          <el-tab-pane label="修改后的数据" name="modifyData">
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="tab-content">
        <preview-table :tableData="selectName === 'originData' ? originData :  modifyData"
        :headerList="selectName === 'originData' ? originHeader :  modifyHead"></preview-table>
      </div>
    </div>
  </div>
</template>
<script>
import PreviewTable from '../create/previewTable.vue';
import { get } from '@/api/server';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      selectName: 'originData',
      originData: [],
      originHeader: [],
      modifyData: [],
      modifyHead: []
    };
  },
  computed: {
    ...mapState(['projectId'])
  },
  components: {
    PreviewTable
  },
  mounted () {
    this.getTableData('RAW');
    this.getTableData('FINAL');
  },
  methods: {
    async getTableData (type) {
      let param = {
        project_id: this.projectId,
        feature_list: type,
        show_title: true,
        row_offset: 0,
        row_limit: 100,
        col_offset: 0,
        col_limit: 2000
      };
      let res = await get('dataTable', param);
      // eslint-disable-next-line no-undef
      let data = d3.csvParse(res, (d) => d);
      if (type === 'RAW') {
        this.setOrigin(data);
      } else {
        this.setModify(data);
      }
    },
    setOrigin (data) {
      this.originHeader = JSON.parse(JSON.stringify(data.columns));
      for (let key of data) {
        this.originData.push(key);
      }
    },
    setModify (data) {
      this.modifyHead = JSON.parse(JSON.stringify(data.columns));
      for (let key of data) {
        this.modifyData.push(key);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.preview-data {
  padding: 16px 40px 16px 24px;
  .title {
    line-height: 24px;
    font-size: 16px;
    color: #FCF8DF;
  }
  .tips {
    line-height: 36px;
    margin-top: 8px;
    color: #A4A4A4;
    font-size: 12px;
  }
  .content {
    width: 100%;
    height: calc(100% - 100px);
    background: #2B2B2B;
    border-radius: 4px;
    overflow: hidden;
    .tab-box {
      height: 40px;
      background: #333;
      border-radius: 4px 4px 0px 0px;
    }
    .tab-content {
      width: 100%;
      height: calc(100% - 40px);
    }
    /deep/ {
      .table-body {
        height: calc(100% - 45px);
      }
    }
  }
}
</style>
<style lang='scss'>
.preview-data {
  .el-tabs__nav-wrap {
    &::after {
      height: 0px!important;
    }
  }
  .el-tabs__item.is-active{
    background: #2B2B2B;
  }
}
</style>
