<template>
  <Dialog title="编辑分箱" :isShow='strEditFlag' :hasPadding="false" :width='1024' :showBtn="true" @cancel='cancelHandler' @confirm="confirmHandler">
    <div class="tips">请统一编辑对应箱体包含的值。</div>
    <div class="panel">
      <div class="add-btn" @click="addBinning"><span class="iconfont icon-db_plus"></span>增加箱体</div>
      <div class="content">
        <div class="panel-left">
          <collapse-content v-bind="$attrs" v-on="$listeners" :list="list" :addIdx="addIdx" :btnIndex="currentIndex" :activeIdx="activeIdx" @btn-click='btnClick'></collapse-content>
        </div>
        <div class="panel-right">
          <div class="info-box" v-if="currentIndex === 3">
            <div v-if="cutList">{{ cutList.length }}个箱体</div>
            <div>包含空箱0个</div>
            <div class="warning-color" v-for="(item, mIdx) in emptyList" :key="mIdx">
              箱体{{ item + 1 }} - 未添加数据。如不需要，请移除。
            </div>
          </div>
          <operate :currentIndex="currentIndex" :currentItem="currentItem" :list="list" @checkValues="checkValues" @on-delete="deleteValues" :activeIdx="activeIdx" @on-cancel="deleteCancel" @on-confirm="deleteConfirm"></operate>
        </div>
      </div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/dialog/index.vue';
import CollapseContent from './collapseContent.vue';
import Operate from './operate.vue';
export default {
  data () {
    return {
      currentIndex: 3,
      list: [],
      listIdx: 0,
      activeIdx: null,
      currentItem: [],
      addIdx: null,
      emptyList: [],
      btnType: null,
      index: null,
      deleteList: [],
      addValues: []
    };
  },
  components: {
    Dialog,
    CollapseContent,
    Operate
  },
  props: {
    strEditFlag: {
      type: Boolean,
      default: false
    },
    cutList: {
      type: Array
    }
  },
  mounted () {
    this.list = JSON.parse(JSON.stringify(this.cutList));
  },
  methods: {
    btnClick (item, idx, index) {
      this.currentItem = item;
      // this.currentItem = JSON.parse(JSON.stringify(item));
      this.currentIndex = index;
      this.listIdx = idx;
      this.emptyList = [];
      if (index === 3) {
        if (this.btnType === 'delete') {
          this.list[this.listIdx].splice(this.index, this.deleteList.length);
        } else if (this.btnType === 'add') {
          this.list.splice(this.listIdx, 1, this.addValues);
          for (let i in this.list) {
            if (Number(i) !== this.listIdx) {
              for (var j = 0; j < this.list[i].length; j++) {
                if (this.addValues.indexOf(this.list[i][j]) > -1) {
                  this.list[i].splice(j, 1);
                  j--;
                }
              }
            }
          }
        }
        this.activeIdx = null;
      } else {
        this.activeIdx = idx;
      }
      this.list.forEach((item, index) => {
        if (item.length === 0) {
          this.emptyList.push(index);
        }
      });
    },
    // 取消移除分箱
    deleteCancel () {
      this.activeIdx = null;
      this.currentIndex = 3;
    },
    // 确定移除分箱
    deleteConfirm () {
      this.currentItem = [];
      this.activeIdx = null;
      this.currentIndex = 3;
      this.list.splice(this.listIdx, 1);
      this.emptyList = [];
      this.list.forEach((item, index) => {
        if (item.length === 0) {
          this.emptyList.push(index);
        }
      });
    },
    // 箱体中添加数值
    checkValues (values, activeIndex) {
      // this.list[this.listIdx] = values;
      this.addValues = values;
      this.btnType = 'add';
    },
    // 删除箱体中的值
    deleteValues (values, index) {
      this.deleteList = values;
      this.index = index;
      this.btnType = 'delete';
      // this.list[this.listIdx].splice(index, values.length);
      // this.currentIndex = 3;
    },
    // 增加箱体
    addBinning () {
      this.list.push([]);
      this.addIdx = this.list.length;
      this.listIdx = this.list.length - 1;
      this.currentIndex = 0;
      this.activeIdx = this.list.length - 1;
    },
    cancelHandler () {
      this.$emit('on-cancel');
    },
    confirmHandler () {
      this.$emit('on-confirm', this.list);
    }
  }
};
</script>
<style lang='scss' scoped>
.tips {
  padding: 16px;
  font-size: 12px;
}
.panel {
  width: calc(100% - 32px);
  height: 420px;
  padding: 16px;
  background: #2B2B2B;
  .add-btn {
    width: 90px;
    height: 20px;
    line-height: 20px;
    margin-bottom: 12px;
    cursor: pointer;
    >span {
      display: inline-block;
      height: 16px;
      line-height: 16px;
      width: 16px;
      background: #F6B421;
      border-radius: 4px;
      text-align: center;
      font-size: 14px;
      margin-right: 8px;
    }
  }
  .content {
    width: 100%;
    height: 420px;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    @include scrollBar(#a4a4a4, 5px);
  }
  .panel-left {
    height: calc(100% - 12px);
    overflow-y: auto;
    width: 480px;
    @include scrollBar(#a4a4a4, 5px);
  }
  .panel-right {
    width: calc(100% - 504px);
    margin-left: 24px;
    .info-box {
      margin-left: 24px;
      color: #A4A4A4;
      font-size: 12px;
      >div {
        line-height: 30px;
      }
    }
  }
  .warning-color{
    color: #EF635C;
  }
}
</style>
