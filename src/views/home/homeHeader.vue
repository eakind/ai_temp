<template>
  <div class="home-header">
    <div class="header-left">
      <div class="title">
        <img src="../../assets/logo.png" width="30" alt="">
        AIBook.cloud
      </div>
    </div>
    <div class="header-right">
      <drop-list :list="langList" :select="lang" @on-change="changeHandler" positionType="left"></drop-list>
    </div>
    <task-list></task-list>
  </div>
</template>
<script>
import DropList from '@/components/dropList/index.vue';
import { mapMutations, mapState } from 'vuex';
import { get } from '@/api/server';
import TaskList from '../taskList.vue';
export default {
  data () {
    return {
      taskFlag: true,
      langList: [{
        name: 'English',
        value: 'en'
      }, {
        name: '繁体中文',
        value: 'hk'
      }, {
        name: '简体中文',
        value: 'zh'
      }],
      routeName: '',
      lang: '简体中文'
    };
  },
  components: {
    DropList,
    TaskList
  },
  computed: {
    ...mapState(['projectId'])
  },
  watch: {
    $route (obj) {
      this.routeName = obj.name;
      this.init();
    }
  },
  created () {
    // this.init();
  },
  methods: {
    ...mapMutations(['setHasFileList', 'setProjectName', 'setModelType', 'setOldProjectList']),
    init () {
      if (this.routeName === 'create') {
        this.projectDetail();
      }
    },
    changeHandler (item) {
      this.lang = item.name;
    },
    async projectDetail () {
      if (!this.projectId) return;
      let params = {
        project_id: this.projectId
      };
      let res = await get('projectDetail', params);
      if (res.code === 0) {
        if (res.file_list.length) {
          res.file_list.forEach(item => {
            if (item.error_code === 0) {
              item.status = 'active_done';
            } else {
              item.status = 'error';
            }
          });
        }
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
    }
  }
};
</script>
<style lang='scss' scoped>
.home-header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  user-select: none;
  background: #333333;
  color: #fff;
  font-size: 14px;
  position: relative;
  .header-left {
    width: 224px;
    display: flex;
    align-items: center;
    justify-content: center;
    .title {
      font-size: 18px;
      font-weight: 400;
      > img {
        margin-right: 5px;
        margin-bottom: -5px;
      }
    }
    &::before {
      content: '';
      width: 224px;
      height: 1px;
      position: absolute;
      top: 60px;
      background: linear-gradient(90deg, #F6B421 0%, #333 100%);
    }
  }
  .header-right {
    position: absolute;
    right: 0px;
    top: 12px;
    margin-right: 80px;
    display: flex;
    align-items: center;
  }
  // .task-list {
  //   position: absolute;
  //   right: 0;
  //   bottom: -36;
  // }
}
</style>
