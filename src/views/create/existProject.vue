<template>
  <Dialog title="套用已有项目" :isShow='dialogFlag' :showBtn="true" @cancel='cancelHandler' @confirm="confirmHandler">
    <div class="tips">
      请选择一个项目，以套用其模型类型和特征工程处理方式。套用该项目后，请保证新数据与该项目列名一致。
    </div>
    <div class="search-box">
      <drop-list :list="typeList" select="全部类型" class="drop-list" @on-change="changeHandler"></drop-list>
      <search-input @change="changekeyWord" :inputValue='keyWord'></search-input>
    </div>
    <div class="table-box">
      <div class="table-header">
        <div class="project-name header-title"><span class="iconfont icon-db_sort"></span>项目名称</div>
        <div class="model-type header-title border-style">模型类型</div>
        <div class="add-time header-title" @click="dateChange"><span class="iconfont icon-db_sort"></span>添加日期</div>
      </div>
      <div class="table-body">
        <scroll-list class="scroll-list" @loadMore="loadMore">
          <div class="table-list" :class="currentIndex === index ? 'isSelected' : ''" v-for="(item, index) in projectList" :key="index" @click="selectProject(item, index)">
            <div class="project-name">
              <span class="choose" :class="currentIndex === index ? 'selectedBorder' : ''">{{ currentIndex === index ? '已选择' : '选择'}}</span>{{ item.project_name }}
            </div>
            <div class="model-type list-color">{{ item.model_type }}</div>
            <div class="add-time list-color">{{ item.insert_time }}</div>
          </div>
        </scroll-list>
      </div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/dialog/index.vue';
import DropList from '@/components/dropList/index.vue';
import SearchInput from '@/components/searchInput/index.vue';
import ScrollList from '@/components/scrollList/index.vue';
import { get, post } from '@/api/server';
import { mapMutations, mapState } from 'vuex';
import { createWs } from '@/mixins/createWs.js';
export default {
  data () {
    return {
      typeList: [{
        name: '全部类型',
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
      timeSelect: '',
      keyWord: '',
      projectList: [],
      offset: 0,
      limit: 10,
      totalNum: 0,
      statusCode: '',
      timeCode: '',
      timeList: [],
      orderBy: 'insert_time',
      selectList: {},
      currentIndex: 0
    };
  },
  mixins: [createWs],
  props: {
    dialogFlag: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Dialog,
    DropList,
    SearchInput,
    ScrollList
  },
  computed: {
    ...mapState(['projectId'])
  },
  mounted () {
    this.initWs();
    this.initData();
  },
  methods: {
    ...mapMutations(['setOldProjectList']),
    createWs () {
      this.initWs();
      window.ws.onmessage = (event) => {
      };
    },
    initData () {
      this.offset = 0;
      this.getProjectList();
    },
    async getProjectList (more) {
      let params = {
        offset: this.offset,
        limit: this.limit,
        direction: this.timeSelect,
        project_name: this.keyWord,
        model_type: this.modelSelect ? this.modelSelect : ''
      };
      console.log(params);
      if (this.timeSelect) {
        params.order_by = this.orderBy;
      }
      let res = await get('applyList', params);
      if (res.code === 0) {
        if (more) {
          this.projectList.push(...res.project_list);
        } else {
          this.projectList = [];
          this.projectList.push(...res.project_list);
          this.selectList = this.projectList.length ? this.projectList[0] : {};
        }
        this.offset += this.limit;
        this.totalNum = res.total_num;
      }
    },
    loadMore () {
      if (this.projectList.length >= this.totalNum) return;
      this.getProjectList(true);
    },
    selectProject (item, index) {
      if (this.currentIndex === index) return;
      this.currentIndex = index;
      this.selectList = item;
    },
    changeHandler (item) {
      this.offset = 0;
      this.modelSelect = item.value;
      this.getProjectList();
    },
    changekeyWord (val) {
      this.offset = 0;
      this.keyWord = val;
      this.getProjectList();
    },
    cancelHandler () {
      this.$emit('on-cancle');
    },
    async confirmHandler () {
      let params = {
        project_id: this.projectId,
        apply_project_id: this.selectList.project_id
      };
      this.createWs();
      let res = await post('projectApply', params);
      if (res.code === 0) {
        this.createWs();
        this.setOldProjectList(this.selectList);
        this.$emit('on-confirm');
      }
    },
    dateChange () {
      this.offset = 0;
      this.timeSelect = (this.timeSelect === 'desc' ? 'asc' : 'desc');
      this.getProjectList();
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
  .drop-list {
    width: 160px;
    height: 36px;
  }
}
.table-box {
  margin-top: 8px;
  .project-name {
    width: calc(100% - 200px);
  }
  .model-type, .add-time {
    padding: 0px 8px;
    width: 130px;
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
      border-right: 1px solid #FCF8DF;
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
      border-bottom: 1px solid #424242;
      cursor: pointer;
    }
    .isSelected {
      background: linear-gradient(170deg, #F6B421 0%, #333333 100%);
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
    .selectedBorder {
      border: 1px solid #fff;
    }
    .list-color {
      opacity: 0.5;
      font-size: 12px;
    }
  }
}
</style>
