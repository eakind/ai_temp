import { get, post } from '@/api/server';
export const taskMixin = {
  data () {
    return {
      idList: []
    };
  },
  mounted () {},
  methods: {
    async getTaskList (type) {
      this.list = [];
      this.idList = [];
      let params = {
        type: type
      };
      let res = await get('taskList', params);
      if (res.code === 0) {
        if (res.active.length) {
          res.active.forEach(item => {
            item.status = 'active';
          });
        }
        if (res.waiting.length) {
          res.waiting.forEach(item => {
            item.status = 'waiting';
            this.idList.push(item.job_id);
          });
        }
        this.activeList = res.active;
        this.waitingList = res.waiting;
        this.list = [...this.activeList, ...this.waitingList];
      }
    },
    setModelName (modelType) {
      if (modelType === 'BINARY_CLASS') {
        return '分类模型';
      } else if (modelType === 'REGRESSION') {
        return '回归模型';
      } else if (modelType === 'SCORECARD') {
        return '评分模型';
      } else if (modelType === 'GLM_BINARY_CLASS') {
        return 'GLM分类模型';
      } else if (modelType === 'GLM_REGRESSION') {
        return 'GLM回归模型';
      } else if (modelType === 'CLUSTERING') {
        return '聚类模型';
      } else {
        return '未知';
      }
    },
    async cancel () {
      let params = {
        job_id: [this.item.job_id]
      };
      let res = await post('taskRemove', params);
      if (res.code === 0) {
        if (this.status === 'active') {
          this.$emit('activeCanceled');
        } else {
          this.$emit('waitingCanceled');
        }
      }
    },
    cancelHandle (type) {
      if (type === 'data') {
        this.getTaskList('data');
      } else {
        this.getTaskList('model');
      }
    },
    async cancleAll (type) {
      let params = {
        job_id: this.idList
      };
      let res = await post('taskRemove', params);
      if (res.code === 0) {
        this.cancelHandle(type);
      }
    }
  }
};
