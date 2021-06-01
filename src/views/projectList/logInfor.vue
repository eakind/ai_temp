<template>
  <Dialog title="项目信息及日志" :isShow='logFlag' @cancel='cancelHandler'>
    <div class="project-id">项目编号：</div>
    <div class="project-name">项目名称：</div>
    <div class="content-box">
      <el-collapse v-model="activeNames" @change="changeHandler">
        <el-collapse-item name="项目文件">
          <template slot="title">
            <span class="num">{{ productInfo.file_num }}个</span>
            <span class=title>项目文件</span>
            <span class="iconfont icon-db_layer"></span>
          </template>
          <div class="content">
            <div>{{ productInfo.file_name }}</div>
          </div>
        </el-collapse-item>
        <el-collapse-item name="日志">
          <template slot="title">
            <span class=title>日志</span>
            <span class="iconfont icon-db_fileLine"></span>
          </template>
          <scroll-list class="content" @loadMore="loadMore">
            <div class="log-item" v-for="(item, index) in logList" :key="index">
              <div>{{ item.content }}</div>
              <div>{{ item.insert_time }}</div>
            </div>
          </scroll-list>
        </el-collapse-item>
      </el-collapse>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/dialog/index.vue';
import ScrollList from '@/components/scrollList/index.vue';
import { mapState } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      activeNames: ['项目文件', '日志'],
      offset: 0,
      limit: 10,
      totalNum: null,
      logList: []
    };
  },
  props: {
    logFlag: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['productInfo'])
  },
  components: {
    Dialog,
    ScrollList
  },
  mounted () {
    this.offset = 0;
    this.getLogList();
  },
  methods: {
    cancelHandler () {
      this.$emit('on-cancle');
    },
    async getLogList (more) {
      let param = {
        project_id: this.productInfo.project_id,
        offset: this.offset,
        limit: this.limit
      };
      let res = await get('projectLog', param);
      if (res.code === 0) {
        if (more) {
          this.logList.push(...res.log_list);
        } else {
          this.logList = [];
          this.logList.push(...res.log_list);
        }
        this.offset += this.limit;
        this.totalNum = res.total_num;
      }
    },
    loadMore () {
      if (this.logList.length >= this.totalNum) return;
      this.getLogList(true);
    },
    changeHandler () {}
  }
};
</script>
<style lang='scss' scoped>
.project-id {
  line-height: 24px;
  color: #A4A4A4;
  font-size: 12px;
}
.project-name {
  line-height: 32px;
  color: #FCF8DF;
  font-size: 14px;
}
.content-box {
  padding: 8px 0px 12px 0px;
  color: #fff;
  font-size: 14px;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  @include scrollBar(#a4a4a4, 5px);
  .num {
    color: #A4A4A4;
  }
  .title {
    color: #FCF8DF;
    padding-right: 40px;
  }
  .icon-db_layer {
    color: #FCF8DF;
    font-size: 18px;
    padding-right: 8px;
  }
  .content {
    margin-left: 20px;
    font-size: 14px;
    color: #fff;
    min-height: 50px;
    max-height: 200px;
    overflow-y: auto;
    @include scrollBar(#a4a4a4, 5px);
    .log-item {
      padding-bottom: 10px;
      border-bottom: 1px solid #A4A4A4;
      >div:nth-child(2) {
        font-size: 12px;
        opacity: 0.5;
        line-height: 24px;
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
