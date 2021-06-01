<template>
  <div class="create">
    <div class="create-project">
      <span>创建项目</span>
      <span @click="createCancel">取消创建</span>
    </div>
    <create-step :select="curIndex" :stepList="stepList" @next="nextHandler" @pre="preHandler" @create="createHandler"></create-step>
    <div class="bottom-box">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <component :is="pageList[curIndex]"></component>
        </keep-alive>
      </transition>
    </div>
    <create-loading v-if="isLoading" @on-return="returnHandler"></create-loading>
  </div>
</template>
<script>
import CreateStep from '@/components/createStep/index.vue';
import ProjectName from './create/projectName.vue';
import ModelData from './create/modelData.vue';
import ConfirmData from './create/confirmData.vue';
import CreateLoading from './create/createLoading.vue';
import { mapMutations, mapState } from 'vuex';
import { post } from '@/api/server';
import { createWs } from '@/mixins/createWs.js';
export default {
  data () {
    return {
      stepList: ['设置名称', '模型数据', '确认数据'],
      pageList: ['project-name', 'model-data', 'confirm-data'],
      curIndex: 0,
      isLoading: false
    };
  },
  mixins: [createWs],
  components: {
    CreateStep,
    ProjectName,
    ModelData,
    ConfirmData,
    CreateLoading
  },
  computed: {
    ...mapState(['projectName', 'currentIndex', 'projectId', 'hasFileList', 'projectStatus'])
  },
  beforeDestroy () {
    // this.setProjectId('');
    // this.setProjectName('');
    this.setCurrentIndex(0);
    // this.setModelType('');
    this.setOldProjectList({});
    this.setHasFileList([]);
    this.setFormatSettingList({});
  },
  created () {
    this.curIndex = this.currentIndex;
  },
  mounted () {
    this.initWs();
    if (this.projectStatus && this.projectStatus === 'ANALYZING') {
      this.isLoading = true;
      this.createWs();
    }
  },
  methods: {
    ...mapMutations(['setProjectId', 'setProjectName', 'setCurrentIndex', 'setModelType', 'setOldProjectList', 'setHasFileList', 'setFormatSettingList']),
    createCancel () {
      if (this.curIndex === 0) {
        this.$router.push({
          path: '/list'
        });
      } else {
        this.$showMessageBox({
          title: '取消创建',
          message: '此操作将返回项目列表，请选择是否保留已创建的内容。',
          confirmText: '保留并返回',
          cancelText: '不保留返回',
          center: true,
          cb: this.saveHanlder,
          cancel: this.notSaveHandler
        });
      }
    },
    saveHanlder () {
      this.$closeMessageBox();
      this.$router.push({ path: '/list' });
    },
    async notSaveHandler () {
      let param = {
        project_id: this.projectId
      };
      let res = await post('delProject', param);
      this.$closeMessageBox();
      if (res.code === 0) {
        this.$router.push({ path: '/list' });
      }
    },
    async nextHandler () {
      if (this.curIndex === 0) {
        if (!this.projectName) {
          this.$message({
            message: '请设置项目名称',
            type: 'warning'
          });
          return;
        }
        if (this.getLen(this.projectName) > 30) {
          this.$message({
            message: '项目名称最多15个中文字符或30个英文字符',
            type: 'warning'
          });
          return;
        }
        let params = {
          project_name: this.projectName
        };
        let res = await post('createProject', params);
        if (res.code === 0) {
          this.setProjectId(res.project_id);
          this.setProjectName(res.project_name);
          this.curIndex++;
          this.setCurrentIndex(this.curIndex);
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      } else if (this.curIndex === 1) {
        if (this.hasFileList.length !== 0) {
          this.curIndex++;
          this.setCurrentIndex(this.curIndex);
        } else {
          this.$message({
            message: '请提供数据文件',
            type: 'warning'
          });
        }
      }
    },
    preHandler () {
      if (this.curIndex === 2) {
        this.curIndex--;
      }
      this.setCurrentIndex(this.curIndex);
    },
    async createHandler () {
      let list = this.hasFileList.filter(item => item.status === 'active_done');
      if (list.length === 0) {
        this.$message({
          message: '无有效文件',
          type: 'warning'
        });
        return;
      }
      this.isLoading = true;
      let params = {
        project_id: this.projectId
      };
      this.createWs();
      let res = await post('completeUpload', params);
      if (res.code === 0) {
        this.createWs();
        // this.isLoading = false;
        // this.$router.push({ path: '/' });
      }
    },
    createWs () {
      this.initWs();
      window.ws.onmessage = (event) => {
        if (!event.data) return;
        let data = JSON.parse(event.data);
        let msgType = data.msg_type;
        let jobType = data.job_type;
        if (msgType === 'active_done' && jobType === 'analyze') {
          this.isLoading = false;
          this.$router.push({ path: '/content' });
        }
      };
    },
    returnHandler () {
      this.$router.push({ path: '/' });
    },
    getLen (name) {
      if (name == null) return 0;
      if (typeof name !== 'string') {
        name += '';
      }
      // eslint-disable-next-line no-control-regex
      return name.replace(/[^\x00-\xff]/g, '01').length;
    }
  }
};
</script>
<style lang='scss' scoped>
.create {
  width: calc(100% - 160px) !important;
  background: #2b2b2b;
  color: #fff;
  font-size: 12px;
  padding: 8px 80px;
  .create-project {
    width: 100%;
    padding-right: 32px;
    display: flex;
    justify-content: space-between;
    >span:nth-child(1) {
      color: #FCF8DF;
      font-size: 16px;
      font-weight: bold;
      display: inline-block;
      line-height: 40px;
      border-bottom: 1px solid #F6B421;
    }
    >span:nth-child(2) {
      display: inline-block;
      width: 80px;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
      color: #A4A4A4;
      cursor: pointer;
    }
  }
  .bottom-box {
    border-top: 1px solid #424242;
    margin-top: 16px;
    height: 100%;
  }
}
</style>
