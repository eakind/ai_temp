<template>
  <Dialog title="编辑分箱" :isShow='intEditFlag' :hasPadding="false" :width='1024' :showBtn="true" @cancel='cancelHandler' @confirm="confirmHandler">
    <div class="tips">请统一编辑对应箱体包含的值。</div>
    <div class="panel">
      <div class="content">
        <div class="panel-left">
          <binning-panel v-bind="$attrs" v-on="$listeners" @btn-click="btnClick" :list="list" :btnIndex="currentIndex" :activeIdx="activeIdx"></binning-panel>
        </div>
        <div class="panel-right">
          <div class="info-box" v-if="currentIndex === 3">
            <div>{{ cutList.length }}个箱体</div>
            <div>包含空箱0个</div>
          </div>
          <tip-panel class="delete-box" :style="{'top': mTop}" v-if="currentIndex === 1">
            <div>确定移除此箱体？</div>
            <div>
              <span @click="confirmClick">确定</span>
              <span @click="cancelClick">取消</span>
            </div>
          </tip-panel>
          <tip-panel class="insert-box" v-if="currentIndex === 0">
            <input type="text" class="input" v-model="IntervalValue" placeholder="请输入（左右区间内数值）">
            <div>
              <span @click="insertConfirm">插入</span>
              <span @click="cancelClick">取消</span>
            </div>
          </tip-panel>
        </div>
      </div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/dialog/index.vue';
import BinningPanel from './binningPanel.vue';
import TipPanel from '@/components/tipPanel/index.vue';
export default {
  data () {
    return {
      currentIndex: 3,
      list: [],
      listIdx: 0,
      activeIdx: null,
      IntervalValue: null
    };
  },
  components: {
    Dialog,
    BinningPanel,
    TipPanel
  },
  computed: {
    mTop () {
      return `${this.activeIdx * 78}px`;
    }
  },
  props: {
    intEditFlag: {
      type: Boolean,
      default: false
    },
    cutList: {
      type: Array
    }
    // leftOpen: {
    //   type: Boolean,
    //   default: false
    // },
    // rightOpen: {
    //   type: Boolean,
    //   default: false
    // }
  },
  mounted () {
    this.list = JSON.parse(JSON.stringify(this.cutList));
  },
  methods: {
    btnClick (idx, index) {
      this.currentIndex = index;
      this.listIdx = idx;
      this.activeIdx = idx;
    },
    cancelClick () {
      this.activeIdx = null;
      this.currentIndex = 3;
    },
    confirmClick () {
      this.activeIdx = null;
      this.currentIndex = 3;
      let len = this.list.length;
      let temp = this.list[this.listIdx];
      this.list.splice(this.listIdx, 1);
      if (this.listIdx !== 0 && this.listIdx !== len - 1) {
        this.list[this.listIdx - 1][1] = temp[1];
      }
      if (this.listIdx === 0) {
        this.list[0][0] = '-Infinity';
      }
      if (this.listIdx === len - 1) {
        this.list[len - 1][1] = '+Infinity';
      }
    },
    insertConfirm () {
      if (!this.IntervalValue) {
        this.$message({
          message: '请输入区间值',
          type: 'warning'
        });
        return;
      }
      if (isNaN(this.IntervalValue)) {
        this.$message({
          message: '请输入数值',
          type: 'warning'
        });
        return;
      }
      this.activeIdx = null;
      this.currentIndex = 3;
      // let len = this.list.length;
      let addNum = this.list[this.listIdx][1];
      let addArr = [Number(this.IntervalValue), addNum];
      this.list[this.listIdx][1] = Number(this.IntervalValue);
      // this.list[this.listIdx + 1][0] = this.IntervalValue;
      this.list.splice(this.listIdx + 1, 0, addArr);
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
  height: 420px;
  padding: 16px;
  background: #2B2B2B;
  .content {
    height: 420px;
    overflow-y: auto;
    display: flex;
    @include scrollBar(#a4a4a4, 5px);
  }
  .panel-left {
    width: 480px;
  }
  .panel-right {
    width: calc(100% - 504px);
    margin-left: 24px;
    position: relative;
    .info-box {
      margin-left: 24px;
      color: #A4A4A4;
      font-size: 12px;
      >div {
        line-height: 30px;
      }
    }
    .delete-box {
      width: calc(100% - 24px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: absolute;
      left: 0px;
      top: 0px;
      >div:nth-child(1) {
        padding-left: 8px;
      }
      >div:nth-child(2) {
        >span {
          display: inline-block;
          width: 80px;
          color: #A4A4A4;
          text-align: center;
          cursor: pointer;
        }
        >span:nth-child(1) {
          color: #F6B421;
        }
      }
    }
    .insert-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #F6B421;
      /deep/.left-icon {
        background: #F6B421;
      }
      .input {
        display: inline-block;
        padding: 0px 8px;
        width: 190px;
        height: 26px;
        line-height: 26px;
        border-radius: 4px;
        background: #333333;
        outline: none;
        border: none;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #fff;
      }
      >div {
        >span {
          display: inline-block;
          width: 80px;
          text-align: center;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
