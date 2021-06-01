<template>
  <div class="model-data">
    <div class="title">项目创建方式</div>
    <div class="title-tip">请指定项目的模型类型。套用已有项目时将直接应用该项目的模型类型和特征工程处理。</div>
    <div class="create-btn">
      <div class="left">{{ useOldFlag }}</div>
      <div class="right" v-if="useOldFlag === '直接创建'" @click="oldProjectClick">套用已有项目<span class="iconfont icon-db_arrow"></span></div>
      <div class="right-btns" v-if="useOldFlag === '套用已有项目'">
        <span @click="reChoose">重新选择</span>
        <span @click="cancelUse">放弃套用</span>
      </div>
    </div>
    <div class="choose-box" v-if="useOldFlag === '直接创建'">
      <div class="choose">
        <span>选择类型</span>
        <drop-list :list="typeList" :select="setSelectName" class="drop-list" @on-change="changeHandler"></drop-list>
      </div>
      <div class="choose-tip">*项目创建后，模型类型无法转换，请谨慎选择。</div>
    </div>
    <div class="choose-box" v-if="useOldFlag === '套用已有项目'">
      <div class="choose">项目名称：{{ oldProjectList.project_name }}</div>
      <div class="choose-tip"><span>{{ oldProjectList.model_type }}</span>{{ oldProjectList.insert_time }}</div>
    </div>
    <div class="upload-title">
      <div class="up-title">上传文件</div>
      <div class="upload-tip">请提供数据文件，并确认“文件格式设置”内的信息。</div>
    </div>
    <div class="bottom-btns">
      <div class="left">
        <upload-btn @change="uploadHandler"></upload-btn>
        <div class="btn" @click="fileFlag=true"><span class="iconfont icon-db_clock"></span>使用历史文件</div>
      </div>
      <div class="setting" @click="settingFlag=true">文件格式设置</div>
    </div>
    <div class="has-file">
      <div class="top">已选文件</div>
      <div class="file-tip">请等待所有文件上传完毕再点击"下一步"。</div>
      <file-list class="file-list" v-for="(item, index) in hasFileList" :key="index" :list="item" :index="index" @on-del="delHandler"></file-list>
    </div>
    <exist-project v-if="dialogFlag" :dialogFlag="dialogFlag" @on-cancle="cancelHandler" @on-confirm="confirmHandler"></exist-project>
    <format-setting v-if="settingFlag" :settingFlag="settingFlag"  @on-cancel="formatCancel" @on-confirm="formatConfirm"></format-setting>
    <choose-file v-if="fileFlag" :fileFlag="fileFlag" @on-cancel="fileCancel" @on-confirm="fileConfirm"></choose-file>
  </div>
</template>
<script>
import DropList from '@/components/dropList/index.vue';
import ExistProject from './existProject.vue';
import FormatSetting from './formatSetting.vue';
import ChooseFile from './chooseFile.vue';
import FileList from './fileList.vue';
import UploadBtn from './uploadBtn.vue';
import { mapMutations, mapState } from 'vuex';
import { post, get } from '@/api/server';
import { createWs } from '@/mixins/createWs.js';
export default {
  data () {
    return {
      typeList: [{
        name: '分类模型',
        value: 'BINARY_CLASS'
      }, {
        name: '回归模型',
        value: 'REGRESSION'
      }, {
        name: '评分模型',
        value: 'SCORECARD'
      }, {
        name: 'GLM分类',
        value: 'GLM_BINARY_CLASS'
      }, {
        name: 'GLM回归',
        value: 'GLM_REGRESSION'
      }, {
        name: '聚类模型',
        value: 'CLUSTERING'
      }],
      dialogFlag: false,
      settingFlag: false,
      fileFlag: false,
      fileList: []
    };
  },
  mixins: [createWs],
  computed: {
    ...mapState(['projectId', 'hasFileList', 'modelType', 'oldProjectList']),
    setSelectName () {
      if (this.modelType) {
        var str = '';
        this.typeList.forEach(item => {
          if (this.modelType === item.value) {
            str = item.name;
          }
        });
      } else {
        str = '分类模型';
      }
      return str;
    },
    useOldFlag () {
      let str = '';
      if (JSON.stringify(this.oldProjectList) !== '{}') {
        str = '套用已有项目';
      } else {
        str = '直接创建';
      }
      return str;
    }
  },
  components: {
    DropList,
    ExistProject,
    FormatSetting,
    ChooseFile,
    FileList,
    UploadBtn
  },
  // watch: {
  //   modelType (val) {
  //     this.updateModelType(val);
  //   }
  // },
  mounted () {
    this.initWs();
    this.getFormatSetting();
    if (!this.modelType) {
      this.setModelType('BINARY_CLASS');
      this.updateModelType('BINARY_CLASS');
    }
  },
  methods: {
    ...mapMutations(['setHasFileList', 'setModelType', 'setOldProjectList', 'setFormatSettingList']),
    async getFormatSetting () {
      let params = {
        project_id: this.projectId
      };
      let res = await get('getFormatSetting', params);
      if (res.code === 0) {
        this.setFormatSettingList(res);
      }
    },
    createWs () {
      this.initWs();
      window.ws.onmessage = (event) => {
        if (!event.data) return;
        let data = JSON.parse(event.data);
        let msgType = data.msg_type;
        let jobType = data.job_type;
        if (jobType === 'read' || jobType === 'readlist') {
          switch (msgType) {
            case 'active_created':
              if (this.hasFileList.length > 0) {
                for (let i in this.hasFileList) {
                  if (this.hasFileList[i].job_id === data.job_id) {
                    this.$set(this.hasFileList[i], 'status', 'active_created');
                  }
                }
              }
              break;
            case 'waiting_created':
              if (this.hasFileList.length > 0) {
                for (let i in this.hasFileList) {
                  if (this.hasFileList[i].job_id === data.job_id) {
                    this.$set(this.hasFileList[i], 'status', 'waiting_created');
                  }
                }
              }
              break;
            case 'active_done':
              if (this.hasFileList.length > 0 && jobType === 'read') {
                for (let i in this.hasFileList) {
                  if (this.hasFileList[i].job_id === data.job_id) {
                    this.$set(this.hasFileList[i], 'status', 'active_done');
                  }
                }
                this.projectFileList();
              }
              if (this.hasFileList.length > 0 && jobType === 'readlist') {
                this.projectFileList();
              }
              break;
          }
        }
      };
    },
    async updateModelType (modelType) {
      let params = {
        project_id: this.projectId,
        model_type: modelType
      };
      let res = await post('updateModelType', params);
      if (res.code === 0) {
        this.setModelType(modelType);
      }
    },
    reChoose () {
      this.dialogFlag = true;
    },
    async cancelUse () {
      let params = {
        project_id: this.projectId
      };
      this.createWs();
      let res = await post('applyDelete', params);
      if (res.code === 0) {
        this.createWs();
        this.setOldProjectList({});
      }
    },
    changeHandler (item) {
      this.updateModelType(item.value);
    },
    oldProjectClick () {
      this.dialogFlag = true;
    },
    cancelHandler () {
      this.dialogFlag = false;
    },
    confirmHandler () {
      this.dialogFlag = false;
    },
    formatCancel () {
      this.settingFlag = false;
    },
    formatConfirm () {
      this.getFormatSetting();
      this.settingFlag = false;
    },
    fileCancel () {
      this.fileFlag = false;
    },
    async fileConfirm (params, selectedList) {
      this.createWs();
      let res = await post('addFile', params);
      if (res.code === 0) {
        this.createWs();
        var temArr = selectedList.filter(item => res.file_id_list.some(ele => ele === item.file_id));
        temArr.forEach(item => {
          item.job_id = res.job_id;
        });
      }
      let list = JSON.parse(JSON.stringify(this.hasFileList));
      this.setHasFileList([...list, ...temArr]);
      this.fileFlag = false;
    },
    async uploadHandler (list) {
      this.fileList = list;
      let formData = new FormData();
      formData.append('project_id', this.projectId);
      formData.append('file', this.fileList[0]);
      this.createWs();
      let res = await post('postUploadFile', formData);
      if (res.code === 0) {
        this.createWs();
        let list = JSON.parse(JSON.stringify(this.hasFileList));
        list.push({
          file_id: res.file_id,
          file_name: res.filename,
          source: 'LOCAL',
          status: 'waiting_created',
          job_id: res.job_id
        });
        this.setHasFileList(list);
        this.fileList = [];
      } else {
        // let list = JSON.parse(JSON.stringify(this.hasFileList));
        // list.push({
        //   file_name: this.fileList[0].name,
        //   file_source: '本地文件',
        //   code: res.code
        // });
        // this.setHasFileList(list);
        // this.fileList = [];
      }
    },
    async getUploadFileList () {
      let params = {
        project_id: this.projectId
      };
      let res = await get('getUploadFile', params);
      if (res.code === 0) {
        this.setHasFileList(res.file_list);
      }
    },
    async delHandler (list, index) {
      if (!list.file_id) {
        this.hasFileList.splice(index, 1);
        return;
      }
      let params = {
        project_id: this.projectId,
        file_id: list.file_id
      };
      this.createWs();
      let res = await post('delFile', params);
      if (res.code === 0) {
        this.createWs();
        this.hasFileList.splice(index, 1);
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        });
      }
    },
    // 获取项目已有文件
    async projectFileList () {
      let params = {
        project_id: this.projectId
      };
      let res = await get('projectFileList', params);
      if (res.code === 0) {
        var list = res.file_list;
        this.hasFileList.forEach(item => {
          list.forEach(lItem => {
            if (item.file_id === lItem.file_id) {
              if (lItem.error_code === 0) {
                item.status = 'active_done';
              } else {
                item.status = 'error';
              }
            }
          });
        });
      };
    }
  }
};
</script>
<style lang='scss' scoped>
@import './style/confirmData.scss';
</style>
