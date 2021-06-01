<template>
  <Dialog title="输出预测" :isShow='outputFlag' :hasPadding="false" :showBtn="showBtn" @cancel='cancelHandler' @confirm="confirmHandler">
    <div class="tips" v-if="selectIndex !== 2">将模型结果输出至本地或BI。</div>
    <div class="header-title" v-if="selectIndex === 2">
      <span>评分卡公式：</span>intercept + ∑  χ  * ω
    </div>
    <div class="output-panel" :class="selectIndex !== 2 ? '' : 'other-panel'">
      <template v-if="selectIndex === 0">
        <div class="title">使用原数据</div>
        <div class="select-box">
          <div class="select-title">选择模型</div>
          <drop-list :list="modelList" :select="modelName" class="drop-list" @on-change="changeData"></drop-list>
        </div>
        <div class="select-box">
          <div class="select-title">数据源</div>
          <drop-list :list="dataList" :select="selectSource" class="source-list" @on-change="changeData"></drop-list>
        </div>
        <div class="select-box">
          <div class="select-title">输出方式</div>
          <div class="btn-box">
            <div class="btn" :class="currentIndex === 0 ? 'isActive' : ''"><span class="iconfont icon-db_download"></span>下载数据表</div>
            <!-- <div class="btn" :class="currentIndex === 1 ? 'isActive' : ''"><span class="iconfont icon-db_run"></span>在BI打开</div> -->
          </div>
        </div>
      </template>
      <template v-if="selectIndex === 1">
        <div class="title">使用新数据</div>
        <div class="title-tips">上传后可获取输出文件，请确保上传的文件与此项目数据列名和类型一致。</div>
        <div class="select-box">
          <div class="select-title">数据源</div>
          <div class="btn-box">
            <upload-btn @change="uploadHandler" v-show="!isLoading && !fileName"></upload-btn>
            <template v-if="isLoading">
              <span class="loadidng-txt">上传中，请稍候...</span>
              <div class="cancel-btn" @click="cancelUpload">
                <span class="iconfont icon-db_plus"></span>取消
              </div>
            </template>
            <template v-if="!isLoading && fileName">
              <span class="file-name">{{fileName}}</span>
              <upload-btn btnTxt="重新上传" @change="uploadHandler" class="upload-btn"></upload-btn>
            </template>
          </div>
        </div>
        <div class="select-box" v-show="!isLoading && fileName">
          <div class="select-title">输出方式</div>
          <div class="btn-box">
            <div class="btn" :class="currentIndex === 0 ? 'isActive' : ''"><span class="iconfont icon-db_download"></span>下载数据表</div>
          </div>
          <div class="error-txt" v-if="isError">获取输出文件失败，请确保上传的文件与此项目数据列名和类型一致，检查后重新上传。</div>
        </div>
      </template>
      <template v-if="selectIndex === 2">
        <div class="table-list header-list">
          <span :style="{width: width}" v-for="(item, hIdx) in headerArr" :key="hIdx">{{item}}</span>
        </div>
        <scroll-list class="table-body" @loadMore="loadMore">
          <div class="table-list body-list" v-for="(item, dIdx) in tableData" :key="dIdx">
            <span :style="{width: width}" v-for="(childrenItem, cIdx) in headerArr" :key="cIdx">22</span>
          </div>
        </scroll-list>
      </template>
    </div>
    <div class="downloadBtn" v-if="selectIndex === 2">下载评分卡(excel)</div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/dialog/index.vue';
import DropList from '@/components/dropList/index.vue';
import ScrollList from '@/components/scrollList/index.vue';
import UploadBtn from '../../../create/uploadBtn.vue';
import { mapState } from 'vuex';
import { download, post, cancel } from '@/api/server';
import { createWs } from '@/mixins/createWs.js';
export default {
  data () {
    return {
      modelName: '',
      currentIndex: 0,
      showBtn: true,
      dataList: [],
      selectSource: '',
      selectData: '',
      fileName: '',
      jobId: '',
      isLoading: false,
      isDownLoad: false,
      isDownLoadNew: false,
      isError: false,
      headerArr: ['featureName', 'weight', 'bin_value', 'bin_woe', 'Points'],
      tableData: [{}, {}, {}]
    };
  },
  mixins: [createWs],
  props: {
    outputFlag: {
      type: Boolean,
      default: false
    },
    selectIndex: {
      type: Number,
      default: 0
    },
    modelList: {
      type: Array
    }
  },
  watch: {
    modelList: {
      handler (list) {
        if (!list.length) return;
        this.modelName = list[0].name;
      },
      deep: true,
      immediate: true
    },
    outputItem: {
      handler (obj) {
        this.setDataList();
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapState(['projectId', 'modelType']),
    ...mapState('result', ['outputItem']),
    width () {
      let len = this.headerArr.length;
      let w = `${100 / len}%`;
      return w;
    }
  },
  created () {
    this.initWs();
    if (this.selectIndex === 2) {
      this.showBtn = false;
    } else {
      this.showBtn = true;
    }
  },
  components: {
    Dialog,
    DropList,
    ScrollList,
    UploadBtn
  },
  methods: {
    setDataList () {
      if (this.outputItem.holdout_status === 'SUCCEED') {
        this.dataList = [{
          name: '隔离集',
          value: 'HOLDOUT'
        }, {
          name: '测试集',
          value: 'VALIDATE'
        }];
      } else {
        this.dataList = [{
          name: '测试集',
          value: 'VALIDATE'
        }];
      }
      this.selectSource = this.dataList[0].name;
      this.selectData = this.dataList[0].value;
    },
    loadMore () {},
    confirmHandler () {
      if (this.selectIndex === 0) {
        this.downLoad();
      } else if (this.selectIndex === 1) {
        if (!this.isLoading && this.fileName) {
          this.downLoadNew();
        }
      }
    },
    async downLoad () {
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        sampling: this.outputItem.sampling,
        dataset: this.selectData
      };
      const name = `${this.projectId}_predict`;
      let res = await download('dataset', params, name);
      if (res.code) {
        this.$message({
          message: this.$t(res.code),
          type: 'warning'
        });
        return;
      }
      this.$emit('confirm');
    },
    async downLoadNew () {
      let params = {
        project_id: this.projectId,
        model_id: this.outputItem.model_id,
        sampling: this.outputItem.sampling,
        job_id: this.jobId
      };
      const name = `${this.projectId}_predict`;
      let res = await download('predictDown', params, name);
      if (res.code) {
        this.$message({
          message: this.$t(res.code),
          type: 'warning'
        });
        return;
      }
      this.$emit('confirm');
    },
    async uploadHandler (fileList) {
      let formData = new FormData();
      this.isLoading = true;
      formData.append('project_id', this.projectId);
      formData.append('model_id', this.outputItem.model_id);
      formData.append('sampling', this.outputItem.sampling);
      formData.append('file', fileList[0]);
      this.fileName = fileList[0].name;
      this.isError = false;
      this.createWs();
      let res = await post('predictFile', formData);
      if (res.code === 0) {
        this.jobId = res.job_id;
        this.createWs();
      }
    },
    createWs () {
      this.initWs();
      window.ws.onmessage = (event) => {
        console.log(JSON.parse(event.data));
        if (!event.data) return;
        let data = JSON.parse(event.data);
        let msgType = data.msg_type;
        let jobType = data.job_type;
        let errorMsg = data.error_msg;
        if (msgType === 'active_done' && jobType === 'predict') {
          this.isLoading = false;
          this.isError = false;
          if (errorMsg) {
            this.isError = true;
          }
        }
      };
    },
    cancelUpload () {
      cancel();
      this.stopPredict();
    },
    async stopPredict () {
      let params = {
        job_id: this.jobId
      };
      await post('taskRemove', params);
      this.fileName = '';
      this.isLoading = false;
      this.jobId = '';
      this.isError = false;
    },
    cancelHandler () {
      this.$emit('cancel');
    },
    changeData () {}
  }
};
</script>
<style lang='scss' scoped>
.tips {
  padding: 8px 16px;
  color: #A4A4A4;
  font-size: 12px;
}
.output-panel {
  width: calc(100% - 32px);
  height: 306px;
  padding: 16px;
  background: #2B2B2B;
}
.title {
  line-height: 36px;
  margin: 8px 0px;
  color: #F6B421;
}
.select-box {
  line-height: 32px;
  margin-bottom: 16px;
  overflow: hidden;
  .select-title {
    color: #FCF8DF;
  }
  .drop-list {
    width: 100%;
  }
  .source-list {
    width: 192px;
  }
  .btn-box {
    display: flex;
    float: left;
  }
  .btn {
    width: 160px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 4px;
    background: #333333;
    cursor: pointer;
    box-sizing: border-box;
    &:nth-child(1) {
      margin-right: 24px;
    }
    >span {
      padding-right: 8px;
    }
  }
  .isActive {
    border: 1px solid #F6B421;
    background: #2B2B2B;
    >span {
      color: #F6B421;
    }
  }
  .loadidng-txt {
    color: #A4A4A4;
  }
  .cancel-btn {
    height: 32px;
    line-height: 32px;
    width: 80px;
    text-align: center;
    border-radius: 4px;
    background: #333;
    cursor: pointer;
    margin-left: 24px;
  }
  .icon-db_plus {
    display: inline-block;
    transform: rotate(45deg);
    margin-right: 8px;
  }
  .file-name {
    line-height: 40px;
    font-size: 12px;
    margin-right: 24px;
  }
  .upload-btn {
    border: none;
    color: #F6B421;
    &::before {
      color: transparent;
    }
  }
  .error-txt {
    color: #EF635C;
  }
}
.title-tips {
  color: #A4A4A4;
  font-size: 12px;
  margin-bottom: 24px;
}
.download-btn {
  width: 128px !important;
  border-radius: 4px;
  background: #2B2B2B !important;
  border: 1px solid #444444 !important;
}
.icon-db10_computer {
  color: #F6B421;
}
.header-title {
  color: #fff;
  padding: 16px 0px 8px 16px;
  >span {
    color: #FCF8DF;
  }
}
.downloadBtn {
  cursor: pointer;
  color: #F6B421;
  text-align: center;
  margin-top: 24px;
  margin-bottom: 8px;
}
.table-list {
  height: 40px;
  line-height: 40px;
  width: 100%;
  >span {
    display: inline-block;
    text-align: center;
    box-sizing: border-box
  }
}
.header-list {
  border-radius: 4px 4px 0px 0px;
  background: #333333;
  color: #FCF8DF;
}
.other-panel {
  padding: 0px;
  height: 338px;
  width: 100%;
}
.table-body {
  width: 100%;
  height: calc(100% - 40px);
  .body-list {
    background: #2B2B2B;
    border-bottom: 1px solid #A4A4A4;
    >span {
      border-right: 1px solid #A4A4A4;
      &:last-child {
        border-right: none;
      }
    }
  }
}
</style>
