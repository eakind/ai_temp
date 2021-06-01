<template>
  <div class="task-panel">
    <scroll-list class="item-box" @loadMore="loadMore" v-if="list.length">
      <div class="top-panel" v-if="activeList.length">
        <item class="item" v-for="(item, aIndex) in activeList"
          :key="aIndex" :item="item" :index="aIndex"
          status="active" @activeCanceled="() => cancelHandle('model')"></item>
      </div>
      <div class="bottom-panel">
        <div class="cancel-btn" @click="cancleAll('model')">全部取消</div>
        <item class="item" v-for="(item, wIndex) in waitingList"
         :key="wIndex" :item="item" :index="wIndex"
          status="waiting" @waitingCanceled="() => cancelHandle('model')"></item>
      </div>
    </scroll-list>
    <div class="no-panel" v-else>暂无进程</div>
  </div>
</template>
<script>
import ScrollList from '@/components/scrollList/index.vue';
import Item from './item.vue';
import { taskMixin } from '../content/mixins/taskMixin.js';
export default {
  data () {
    return {
      list: [],
      taskTimer: null
    };
  },
  mixins: [taskMixin],
  components: {
    ScrollList,
    Item
  },
  props: {
    taskFlag: {
      type: Boolean
    }
  },
  watch: {
    taskFlag (val) {
      if (!val) {
        clearInterval(this.taskTimer);
        this.taskTimer = null;
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.taskTimer);
    this.taskTimer = null;
  },
  mounted () {
    this.getTaskList('model');
    this.taskTimer = setInterval(() => {
      this.getTaskList('model');
    }, 30000);
  },
  methods: {
    loadMore () {}
  }
};
</script>
<style lang='scss' scoped>
.task-panel {
  height: calc(100% - 32px);
  width: 100%;
  padding: 8px 16px;
  box-sizing: border-box;
  overflow-y: auto;
  @include scrollBar(#a4a4a4, 5px);
  .item-box {
    width: 100%;
  }
  .item {
    margin-bottom: 8px;
  }
  .no-panel {
    color: #a4a4a4;
    text-align: center;
    margin-top: 100px;
  }
  .cancel-btn {
    text-align: right;
    color: #F6B421;
    text-decoration: underline;
    line-height: 24px;
    margin: 8px 0px;
    cursor: pointer;
  }
  .top-panel {
    margin-bottom: 16px;
    border-bottom: 1px solid #424242;
  }
}
</style>
