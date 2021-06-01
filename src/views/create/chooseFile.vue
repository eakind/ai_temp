<template>
  <Dialog title="选择历史文件" :isShow='fileFlag' :showBtn="true" @cancel='cancelHandler' @confirm="confirmHandler">
    <div class="tips">
      支持同时选择多个历史文件
    </div>
    <div class="search-box">
      <search-input @change="changekeyWord" :inputValue='keyWord'></search-input>
    </div>
    <div class="table-box">
      <div class="table-header">
        <div class="file-name header-title"><span class="iconfont icon-db_sort" @click="sortHandler('file_name')"></span>文件名称</div>
        <div class="add-time header-title border-style"><span class="iconfont icon-db_sort" @click="sortHandler('upload_time')"></span>添加日期</div>
      </div>
      <div class="table-body">
        <scroll-list class="scroll-list" @loadMore="loadMore">
          <div class="table-list" v-for="item in fileList" :key="item.file_id">
            <div class="file-name">
              <el-checkbox v-model="item.selectFlag">{{ item.file_name }}</el-checkbox>
            </div>
            <div class="add-time list-color">{{ item.upload_time}}</div>
          </div>
        </scroll-list>
      </div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/dialog/index.vue';
import SearchInput from '@/components/searchInput/index.vue';
import ScrollList from '@/components/scrollList/index.vue';
import { get } from '@/api/server';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      typeList: [{
        name: '全部类型',
        value: ''
      }, {
        name: '分类模型',
        value: ''
      }, {
        name: '回归模型',
        value: ''
      }, {
        name: '评分模型',
        value: ''
      }, {
        name: 'GLM分类',
        value: ''
      }, {
        name: 'GLM回归',
        value: ''
      }, {
        name: '聚类模型',
        value: ''
      }],
      offset: 0,
      limit: 10,
      orderBy: '',
      reverse: false,
      keyWord: '',
      totalNum: 0,
      fileList: [],
      selectedList: []
    };
  },
  props: {
    fileFlag: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['projectId'])
  },
  components: {
    Dialog,
    SearchInput,
    ScrollList
  },
  mounted () {
    this.getFileList();
  },
  methods: {
    async getFileList (more) {
      let params = {
        offset: this.offset,
        limit: this.limit,
        order_by: this.orderBy,
        reverse: this.reverse,
        key_word: this.keyWord
      };
      let res = await get('myFiles', params);
      if (res.code === 0) {
        if (more) {
          this.fileList.push(...res.file_list);
        } else {
          this.fileList = [];
          this.fileList.push(...res.file_list);
        }
        this.offset += this.limit;
        this.totalNum = res.total_num;
      }
    },
    sortHandler (orderBy) {
      this.orderBy = orderBy;
      this.reverse = !this.reverse;
      this.offset = 0;
      this.getFileList();
    },
    changekeyWord (val) {
      this.keyWord = val;
      this.offset = 0;
      this.getFileList();
    },
    loadMore () {
      if (this.fileList.length >= this.totalNum) return;
      this.getFileList(true);
    },
    cancelHandler () {
      this.$emit('on-cancel');
    },
    async confirmHandler () {
      var fileArr = [];
      this.fileList.forEach(item => {
        if (item.selectFlag) {
          fileArr.push(item.file_id);
          this.selectedList.push({
            file_id: item.file_id,
            file_name: item.file_name,
            source: 'HISTORY',
            status: 'waiting_created'
          });
        }
      });
      if (fileArr.length === 0) {
        this.$message({
          message: '请选择文件',
          type: 'warning'
        });
        return;
      }
      let params = {
        project_id: this.projectId,
        file_id_list: fileArr
      };
      this.$emit('on-confirm', params, this.selectedList);
    },
    // 获取项目已有文件
    async projectFileList () {
      let params = {
        project_id: this.projectId
      };
      let res = await get('projectFileList', params);
      if (res) {};
    }
  }
};
</script>
<style lang='scss' scoped>
.tips {
  margin: 8px 0px;
  line-height: 24px;
  font-size: 12px;
  color: #A4A4A4;
}
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-box {
  margin-top: 8px;
  .file-name {
    width: calc(100% - 100px);
  }
  .add-time {
    padding: 0px 8px;
    width: 150px;
  }
  .table-header {
    padding: 4px 8px;
    width: calc(100% - 16px);
    height: 24px;
    line-height: 24px;
    color: #ffffff;
    font-size: 14px;
    background: #424242;
    border-radius: 4px;
    display: flex;
    align-items: center;
    .header-title {
      color: #FCF8DF;
      .icon-db_sort {
        cursor: pointer;
        margin: 0px 8px;
      }
    }
    .border-style {
      border-left: 1px solid #FCF8DF;
    }
  }
  .table-body {
    max-height: 270px;
    overflow: hidden;
    padding: 8px 0px;
    background: #333333;
    border-radius: 0px 0px 4px 4px;
    .scroll-list {
      max-height: 270px;
      @include scrollBar(#a4a4a4, 5px);
    }
    .table-list {
      padding: 0px 8px;
      height: 32px;
      line-height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #424242;;
    }
    .choose {
      display: inline-block;
      font-size: 12px;
      height: 21px;
      line-height: 21px;
      width: 48px;
      text-align: center;
      border-radius: 4px;
      border: 1px solid #F6B421;
      margin-right: 8px;
    }
    .list-color {
      opacity: 0.5;
      font-size: 12px;
    }
  }
}
</style>
