<template>
  <div class='content'>
    <div class="content-left">
      <div class="back" @click="backHandler">
        <span class="iconfont icon-db_arrow"></span>
        返回项目列表
      </div>
      <div class="info-box">
        <div class="top">{{projectName}}</div>
        <div class="bottom">
          <span>{{ hasFileList.length }}个文件</span>
          <span @click="showFileList = !showFileList" v-click-out="hide">详细</span>
          <file-panel class="file-panel" v-if="showFileList"></file-panel>
        </div>
      </div>
      <div class="tab-list" :class="currentIndex === 0 ? 'active' : ''" @click="menuHandler(0)">
        <div class="tab-title">
          <span class="iconfont icon-dbc_chart" :class="currentIndex === 0 ? 'active-color' : ''"></span>
          <span :class="currentIndex === 0 ? 'active-tab' : 'not-active-tab'">建模数据</span>
        </div>
        <div class="list" v-if="projectStatus !== 'PROCESSING' && projectStatus !== 'PROCESSED'">
          <span :class="selectIndex === 0 ? 'active-color' : ''" @click="changetab(0)">目标与特征工程</span>
          <span :class="selectIndex === 1 ? 'active-color' : ''" @click="changetab(1)">查看数据表</span>
        </div>
      </div>
      <div class="tab-list padding-style" :class="currentIndex === 1 || currentIndex === 2 ? 'active' : ''"  @click="menuHandler(1)">
        <div class="tab-title">
          <span class="iconfont icon-db_blockProject" :class="currentIndex === 1 || currentIndex === 2 ? 'active-color' : ''"></span>
          <span :class="currentIndex === 1 || currentIndex === 2 ? 'active-tab' : 'not-active-tab'">模型结果</span>
        </div>
        <div class="list">
          <span v-if="projectStatus !== 'PROCESSING' && projectStatus !== 'PROCESSED'">未建模</span>
          <span v-if="projectStatus === 'PROCESSING' || projectStatus === 'PROCESSED'" :class="currentIndex === 1 ? 'active-color' : ''" @click.stop="toModelList">模型列表</span>
          <span v-if="currentIndex === 2" :class="currentIndex === 2 ? 'active-color' : ''" @click.stop="menuHandler(2)">— 结果评价</span>
        </div>
      </div>
    </div>
    <router-view class="content-right"></router-view>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import FilePanel from './content/filePanel.vue';
import { get } from '@/api/server';
export default {
  data () {
    return {
      currentIndex: 0,
      selectIndex: 0,
      showFileList: false,
      projectName: ''
    };
  },
  components: {
    FilePanel
  },
  computed: {
    ...mapState(['hasFileList', 'projectId', 'projectStatus'])
  },
  watch: {
    $route (obj) {
      this.setMenu(obj.name);
    }
  },
  mounted () {
    this.setMenu(this.$route.name); // 设置当前菜单
    this.getTargetModel(); // 获取模型目标特征
    this.projectDetail();
  },
  methods: {
    ...mapMutations(['setHasFileList', 'setProjectName', 'setModelType', 'setOldProjectList']),
    ...mapMutations('content', ['setTargetFeature', 'setMetricsSelect', 'setMetricsList']),
    setMenu (name) {
      console.log(name);
      switch (name) {
        case 'building':
          this.currentIndex = 1;
          break;
        case 'result':
          this.currentIndex = 2;
          break;
      };
    },
    menuHandler (index) {
      if (this.currentIndex === index) return;
      if ((this.projectStatus === 'PROCESSING' || this.projectStatus === 'PROCESSED') && index === 0) return;
      if ((this.projectStatus !== 'PROCESSING' && this.projectStatus !== 'PROCESSED') && index === 1) return;
      this.currentIndex = index;
    },
    toModelList () {
      this.$router.push({ path: '/content/building' });
      this.currentIndex = 1;
    },
    initPage () {
    },
    async projectDetail () {
      if (!this.projectId) return;
      let params = {
        project_id: this.projectId
      };
      let res = await get('projectDetail', params);
      if (res.code === 0) {
        this.projectName = res.project_name;
        this.setHasFileList(res.file_list);
        this.setProjectName(res.project_name);
        this.setModelType(res.model_type);
        if (res.template_id) {
          this.setOldProjectList({
            project_id: res.template_id,
            project_name: res.template_name,
            model_type: res.model_type,
            insert_time: res.template_insert_time
          });
        }
      }
    },
    changetab (index) {
      if (this.selectIndex === index) return;
      this.selectIndex = index;
      if (index === 0) {
        this.$router.push({ path: '/content' });
      } else if (index === 1) {
        this.$router.push({ path: '/content/previewdata' });
      }
    },
    backHandler () {
      this.$router.push({
        path: '/list'
      });
    },
    hide () {
      this.showFileList = false;
    },
    async getTargetModel () {
      let params = {
        project_id: this.projectId
      };
      let res = await get('getTargetModel', params);
      if (res.code === 0) {
        let list = res.metrics_list;
        let arr = [];
        if (!res.target_feature_idx && res.target_feature_idx !== 0) {
          this.setTargetFeature(null);
          return;
        };
        list.forEach((item, index) => {
          arr.push({
            name: item.metric_name,
            value: item.metric_code
          });
          if (res.optimize_metric === item.metric_code) {
            this.setMetricsSelect(item.metric_name);
          }
        });
        this.setMetricsList(arr);
        this.targetFeaDetail(res.target_feature_idx, true);
      }
    },
    // 获取目标特征详情
    async targetFeaDetail (featureIdx) {
      let params = {
        project_id: this.projectId,
        feature_idx: featureIdx
      };
      let res = await get('featureDetail', params);
      if (res.code === 0) {
        this.setTargetFeature(res);
        this.bus.$emit('refreshTargetChart');
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.content {
  height: 100%;
  width: 100%;
  display: flex;
  background: #222;
  color: #fff;
  font-size: 14px;
  .content-left {
    width: 224px;
    height: 100%;
    background: #333;
    .back {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #424242;
      margin: 0px 16px;
      cursor: pointer;
      .icon-db_arrow {
        display: inline-block;
        color: #F6B421;
        transform: rotate(180deg);
        padding: 0px 8px;
      }
    }
    .info-box {
      margin: 0px 16px;
      padding: 12px 0px;
      border-bottom: 1px solid #424242;
      .top {
        color: #FCF8DF;
      }
      .bottom {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        position: relative;
        >span:nth-child(2) {
          text-decoration: underline;
          cursor: pointer;
        }
        .file-panel {
          position: absolute;
          left: -16px;
          top: 28px;
          z-index: 1;
        }
      }
    }
    .tab-list {
      padding: 0px 16px;
      cursor: pointer;
      position: relative;
      .active-color {
        color: #F6B421;
        opacity: 1;
      }
    }
    .active {
      background: #222;
      &::before {
        content: '';
        height: 100%;
        width: 2px;
        border-radius: 4px;
        position: absolute;
        top: 0px;
        left: 0px;
        background: linear-gradient(0deg, #EDDE5D 0%, #F09819 100%);
      }
    }
    .tab-title {
      color: #FCF8DF;
      font-size: 16px;
      padding: 8px 0px;
      >span {
        color: #FCF8DF;
        padding-right: 8px;
      }
      .active-tab {
        color: #FCF8DF;
        opacity: 1.0;
      }
      .not-active-tab {
        color: #fff;
        opacity: 0.5;
      }
    }
    .padding-style {
      padding-top: 18px;
      padding-bottom: 18px;
    }
    .list {
      >span {
        display: block;
        padding: 8px 0px 8px 24px;
        color: #fff;
        opacity: 0.5;
      }
    }
  }
  .content-right {
    width: calc(100% - 224px);
    overflow: hidden;
    height: 100%  ;
  }
}
</style>
