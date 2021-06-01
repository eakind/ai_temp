<template>
  <div class="confirm-box">
    <div class="title">确认信息</div>
    <div class="title-tip">请确认项目信息和数据后，点击"开始创建"。</div>
    <div class="content">
      <div class="left">
        <div class="title">项目名称</div>
        <div class="title-tip">{{ projectName }}</div>
        <div class="title">模型类型</div>
        <div class="title-tip">{{ modelType }}</div>
        <div class="title">数据文件</div>
        <template v-if="fileList.length > 0">
          <div class="title-tip" v-for="(item, index) in fileList" :key="index" >{{ item.file_name }}</div>
        </template>
      </div>
      <div class="right">
        <preview-table :tableData="tableData" :headerList="headerList" v-if="fileList.length > 0"></preview-table>
      </div>
    </div>
  </div>
</template>
<script>
import { get } from '@/api/server';
import { mapState, mapMutations } from 'vuex';
import PreviewTable from './previewTable.vue';
export default {
  data () {
    return {
      headerList: [],
      tableData: [],
      fileList: []
    };
  },
  components: {
    PreviewTable
  },
  computed: {
    ...mapState(['projectName', 'projectId', 'modelType', 'hasFileList'])
  },
  activated () {
    this.projectFileList();
  },
  mounted () {
    // this.initData();
    this.projectFileList(); // 获取项目已有文件
  },
  methods: {
    ...mapMutations(['setHasFileList']),
    async projectFileList () {
      let params = {
        project_id: this.projectId
      };
      let res = await get('projectFileList', params);
      if (res.code === 0) {
        if (res.file_list.length === 0) {
          this.fileList = [];
        } else {
          res.file_list.forEach(item => {
            if (item.error_code === 0) {
              item.status = 'active_done';
            } else {
              item.status = 'error';
            }
          });
          this.fileList = res.file_list.filter(item => item.error_code === 0);
          this.initData();
        }
        // let temp = JSON.parse(JSON.stringify(this.hasFileList));
        // let arr = temp.filter(item => this.fileList.some(lItem => lItem.file_id === item.file_id));
        // console.log(arr);
        this.setHasFileList(this.fileList);
      };
    },
    async initData () {
      let params = {
        project_id: this.projectId
      };
      let res = await get('getPreviewData', params);
      if (typeof res === 'string') {
        let data = this.evil(res);
        this.headerList = data.column;
        this.tableData = data.data;
      } else {
        this.headerList = res.column;
        this.tableData = res.data;
      }
      // eslint-disable-next-line no-undef
      // let data = d3.csvParse(res, (d) => d);
      // this.headerList = JSON.parse(JSON.stringify(data.columns));
      // for (let key of data) {
      //   this.tableData.push(key);
      // }
    },
    evil (fn) {
      // 一个变量指向Function，防止有些前端编译工具报错
      let Fn = Function;
      return new Fn('return ' + fn)();
    }
  }
};
</script>
<style lang='scss' scoped>
.confirm-box {
  height: 100%;
  margin-top: 16px;
  font-size: 14px;
  color: #fff;
  .title {
    line-height: 32px;
    position: relative;
    &::after {
      content: '';
      height: 1px;
      width: 52px;
      background: #F6B421;
      position: absolute;
      left: 0px;
      bottom: 0px;
    }
  }
  .title-tip {
    font-size: 12px;
    color: #A4A4A4;
    margin-top: 3px;
    margin-bottom: 8px;
  }
  .content {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .left {
      width: 192px;
      height: 100%;
      border-radius: 4px;
      background: #222222;
      padding: 16px;
    }
    .right {
      margin-left: 16px;
      width: calc(100% - 224px);
      border-radius: 4px;
      background: #222222;
    }
  }
}
</style>
