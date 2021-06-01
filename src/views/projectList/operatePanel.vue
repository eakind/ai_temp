<template>
  <div class="operate-panel">
    <div class="panel" v-for="(item, index) in panelList" :key='index' @click="operateHandler(index)">
      <span class="iconfont" :class="item.icon"></span>
      {{ item.name }}
    </div>
    <div class="exit-box" @click="exitHandler">
      <span class="iconfont icon-db_plus"></span>
      退出操作
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
export default {
  data () {
    return {
      panelList: [{
        name: '查看项目信息和日志',
        icon: 'icon-dbc10_orderRb'
      }, {
        name: '修改名称',
        icon: 'icon-db_edit'
      }, {
        name: '删除项目',
        icon: 'icon-db_trash'
      }]
    };
  },
  props: {
    list: {
      type: Object
    }
  },
  methods: {
    ...mapMutations(['setProductInfo']),
    operateHandler (index) {
      this.setProductInfo(this.list);
      if (index === 0) {
        this.$emit('on-log');
        this.$emit('exit');
      } else if (index === 1) {
        this.$showMessageBox({
          inputObj: {
            show: true
          },
          title: '更改项目名称',
          secondTitle: `原名称：${this.list.project_name}`,
          placeHolder: '请输入新名称',
          center: true,
          show: true,
          cb: this.rename
        });
      } else if (index === 2) {
        this.$showMessageBox({
          title: '删除项目',
          message: '删除项目后，不保留项目内已有模型结果。确定立即删除？',
          center: true,
          cb: this.sureDel
        });
      }
    },
    rename (value) {
      if (!value) {
        this.$message({
          message: '请输入新名称',
          type: 'warning'
        });
        return;
      }
      if (this.getLen(value) > 30) {
        this.$message({
          message: '最多输入30个字符',
          type: 'warning'
        });
        return;
      }
      this.$closeMessageBox();
      this.$emit('on-rename', value);
    },
    getLen (val) {
      if (val === null) return 0;
      if (typeof val !== 'string') {
        val += '';
      }
      // eslint-disable-next-line no-control-regex
      return val.replace(/[^\x00-\xff]/g, '01').length;
    },
    sureDel () {
      this.$closeMessageBox();
      this.$emit('on-del');
    },
    exitHandler () {
      this.$emit('exit');
    }
  }
};
</script>
<style lang='scss' scoped>
.operate-panel {
  position: absolute;
  width: 100%;
  height: 150px;
  padding: 0px 16px;
  z-index: 2;
  box-sizing: border-box;
  background: #333333;
  bottom: 0px;
  left: 0px;
  border-radius: 0px 0px 4px 4px;
  .panel {
    height: 36px;
    line-height: 36px;
    color: #fff;
    font-size: 14px;
    border-bottom: 1px solid #444444;
    cursor: pointer;
    >span {
      margin: 0px 8px;
      background: linear-gradient(90deg, #89F7FE 0%, #66A6FF 100%);
      background-clip: text;
      color: transparent;
    }
  }
  .exit-box {
    height: 36px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #A4A4A4;
    font-size: 14px;
    cursor: pointer;
    .icon-db_plus {
      margin: 0px 8px;
      display: inline-block;
      transform: rotate(45deg);
    }
  }
}
</style>
