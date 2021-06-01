<template>
  <div class="task-panel">
    <div class="task-list">
      <div class="task-btn" @click="taskFlag=true">
        <span class="triangle" :class="taskFlag ? 'rotated' : ''"></span>
        任务进程（全部项目）
      </div>
    </div>
    <el-drawer title="任务进程" :visible.sync="taskFlag" :with-header="false">
      <div class="task-tab">
        <el-tabs v-model="selectName">
          <el-tab-pane label="建模任务" name="modelingTask">
          </el-tab-pane>
          <el-tab-pane label="数据任务" name="dataTask">
          </el-tab-pane>
        </el-tabs>
      </div>
      <transition name="fade" mode="out-in">
        <component :is="selectName" :taskFlag="taskFlag" v-bind="$attrs"></component>
      </transition>
    </el-drawer>
  </div>
</template>
<script>
import ModelingTask from './taskList/modelingTask.vue';
import DataTask from './taskList/dataTask.vue';
export default {
  data () {
    return {
      taskFlag: false,
      selectName: 'modelingTask'
    };
  },
  components: {
    ModelingTask,
    DataTask
  },
  methods: {
  }
};
</script>
<style lang='scss' scoped>
.task-list{
  position: absolute;
  right: 0px;
  bottom: -36px;
  z-index: 1;
  .task-btn {
    width: 192px;
    height: 36px;
    line-height: 36px;
    padding-left: 22px;
    display: inline-block;
    text-align: center;
    background: #333333;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    .triangle {
      width:0;
      height:0;
      border-right:6px solid transparent;
      border-left:6px solid transparent;
      border-top:6px solid #fff;
      position: absolute;
      left: 15px;
      top: 15px;
    }
    .rotated {
      transform: rotate(180deg);
    }
    &::before {
      content: '';
      width: 192px;
      height: 1px;
      position: absolute;
      top: 0px;
      right: 0px;
      background: linear-gradient(90deg, #333 0%, #F6B421 100%);
    }
  }
}
</style>
<style lang='scss'>
.task-panel {
  .el-drawer {
    background: linear-gradient(180deg, #333333 0%, #333333 100%);
    box-shadow: 0px 4px 5px 0px #333,0px 24px 56px 0px #000000;
  }
  .el-drawer.ltr, .el-drawer.rtl, .el-drawer__container {
    top: 30px;
    height: calc(100% - 30px);
  }
  .el-tabs__nav {
    width: 100%;
  }
  .el-tabs__item {
    width: 50%
  }
  .el-tabs__active-bar {
    width: 60px !important;
  }
}
.v-modal {
  top: 60px;
}
</style>
