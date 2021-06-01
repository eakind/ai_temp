import { get } from '@/api/server';

export default {
  data () {
    return {
      offset: 0,
      limit: 40,
      totalNum: 0,
      projectList: [],
      keyWord: '',
      statusCode: '',
      timeCode: '',
      timeList: [],
      statusList: [],
      orderBy: 'insert_time'
    };
  },
  computed: {
    hasProject () {
      if (this.projectList.length === 0 && this.keyWord) {
        return false;
      }
      return true;
    }
  },
  mounted () {
  },
  methods: {
    initData () {
      this.offset = 0;
      this.getProjectList();
    },
    async getProjectList (more) {
      let params = {
        offset: this.offset,
        limit: this.limit,
        status: this.statusSelect,
        model_type: this.modelSelect,
        direction: this.timeSelect,
        project_name: this.keyWord
      };
      if (this.timeSelect) {
        params.order_by = this.orderBy;
      }
      let res = await get('projectList', params);
      if (res.code === 0) {
        if (more) {
          this.projectList.push(...res.project_list);
        } else {
          this.projectList = [];
          this.projectList.push(...res.project_list);
        }
        this.offset += this.limit;
        this.totalNum = res.total_num;
      }
    },
    loadMore () {
      if (this.projectList.length >= this.totalNum) return;
      this.getProjectList(true);
    },
    async projectDetail () {
      if (!this.projectId) return;
      let params = {
        project_id: this.projectId
      };
      let res = await get('projectDetail', params);
      if (res.code === 0) {
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
