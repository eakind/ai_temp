<template>
  <div class="project-list">
    <list-left></list-left>
    <div class="list-right">
      <div class="list-header">
        <div class="create-box" @click="creatNewProject">
          <span class="iconfont icon-db_plus"></span>
          新建项目
        </div>
      </div>
      <div class="select-box">
        <div class="left">
          <drop-list :list="statusList" select="全部状态" class="drop-list" @on-change="changeStatus"></drop-list>
          <drop-list :list="timeList" select="最近创建" class="drop-list" @on-change="changeTime"></drop-list>
          <drop-list :list="modelList" select="全部模型" class="drop-list" @on-change="changeModel"></drop-list>
        </div>
        <div class="search">
          <search-input @change="changekeyWord" :inputValue='keyWord'></search-input>
        </div>
      </div>
      <scroll-list class="scroll-list" @loadMore="loadMore">
        <div class="list-box" v-if="hasProject">
          <list v-for="(list, lIdx) in projectList" :key="lIdx" class="list"
            :list="list" @rename="(params) => onRename(list, params)"
            @deled="() => deledHandler(lIdx)" @log-detail="logHandler"
            @on-enter="enterHandler"
          ></list>
        </div>
        <div class="no-project" v-if="!hasProject">
          <span class="iconfont icon-db10_aiNull"> </span>
          <div class="no-result">没有相关结果</div>
          <div class="to-back" @click="returnList">返回项目列表</div>
        </div>
      </scroll-list>
    </div>
    <log-infor v-if="logFlag" :logFlag="logFlag" @on-cancle="cancelHandler"></log-infor>
  </div>
</template>
<script>
import ListLeft from './projectList/listLeft.vue';
import DropList from '@/components/dropList/index.vue';
import SearchInput from '@/components/searchInput/index.vue';
import ScrollList from '@/components/scrollList/index.vue';
import List from './projectList/list.vue';
import projectList from './projectList/mixins/projectList.js';
import LogInfor from './projectList/logInfor.vue';
import { mapMutations, mapState } from 'vuex';
export default {
  data () {
    return {
      statusList: [{
        name: '全部状态',
        value: ''
      }, {
        name: '上传中',
        value: 'UPLOADING'
      }, {
        name: '分析中',
        value: 'UPLOADED'
      }, {
        name: '已建模',
        value: 'PROCESSING'
      }],
      statusSelect: '',
      timeList: [{
        name: '最近创建',
        value: 'desc'
      }, {
        name: '最早创建',
        value: 'asc'
      }],
      timeSelect: '',
      modelList: [{
        name: '全部模型',
        value: ''
      }, {
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
      modelSelect: '',
      projectList: [],
      logFlag: false
    };
  },
  mixins: [projectList],
  components: {
    ListLeft,
    DropList,
    SearchInput,
    ScrollList,
    List,
    LogInfor
  },
  computed: {
    ...mapState(['projectId'])
  },
  mounted () {
    this.initData();
    this.resetState();
  },
  methods: {
    ...mapMutations(['setProjectId', 'setCurrentIndex', 'setProductInfo', 'setFormatSettingList',
      'setHasFileList', 'setProjectName', 'setModelType', 'setOldProjectList', 'setProjectStatus']),
    ...mapMutations('content', ['setSelectedFeature', 'setTargetFeature', 'setMetricsList', 'setMetricsSelect']),
    ...mapMutations('result', ['setWaitList', 'setActiveList']),
    changeStatus (item) {
      this.offset = 0;
      this.statusSelect = item.value;
      this.getProjectList();
    },
    changeTime (item) {
      this.offset = 0;
      this.timeSelect = item.value;
      this.getProjectList();
    },
    changeModel (item) {
      this.offset = 0;
      this.modelSelect = item.value;
      this.getProjectList();
    },
    changekeyWord (val) {
      this.offset = 0;
      this.keyWord = val;
      this.getProjectList();
    },
    returnList () {
      this.offset = 0;
      this.keyWord = '';
      this.statusSelect = '';
      this.modelSelect = '';
      this.getProjectList();
    },
    onRename (list, params) {
      Object.assign(list, params);
    },
    deledHandler (index) {
      this.projectList.splice(index, 1);
    },
    logHandler () {
      this.logFlag = true;
    },
    cancelHandler () {
      this.logFlag = false;
    },
    creatNewProject () {
      this.setCurrentIndex(0);
      this.$router.push({
        path: '/create'
      });
    },
    enterHandler (item) {
      this.setProjectId(item.project_id);
      this.setModelType(item.model_type);
      this.projectDetail();
      this.setProjectStatus(item.status);
      if (item.status === 'UPLOADING') {
        this.$router.push({ path: '/create' });
        this.setCurrentIndex(1);
      } else if (item.status === 'ANALYZING') {
        this.$router.push({ path: '/create' });
        this.setCurrentIndex(2);
      } else if (item.status === 'PROCESSING' || item.status === 'PROCESSED') {
        this.$router.push({ path: '/content/building' });
      } else {
        this.$router.push({ path: '/content' });
      }
    },
    resetState () {
      this.setProjectId('');
      this.setProjectName('');
      this.setProjectStatus('');
      this.setModelType('');
      this.setHasFileList([]);
      this.setProductInfo({});
      this.setCurrentIndex(0);
      this.setOldProjectList({});
      this.setFormatSettingList({});
      this.setSelectedFeature(null);
      this.setTargetFeature(null);
      this.setMetricsList([]);
      this.setMetricsSelect('');
      this.setWaitList([]);
      this.setActiveList([]);
    }
  }
};
</script>
<style lang='scss' scoped>
@import './projectList/style/projectList.scss';
</style>
