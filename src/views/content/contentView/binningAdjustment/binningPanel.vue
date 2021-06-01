<template>
  <div class="binning-panel">
    <div v-for="(item, index) in list" :key="index" class="item" :class="index === activeIdx ? 'active' : ''">
      <div class="item-top">
        <div class="title" :class="index === activeIdx ? 'active-color' : 'normal-color'">
          <span :class="index === activeIdx ? 'left-icon' : 'no-operate-icon'"></span>
          箱体{{index+1}}
        </div>
        <div class="btns" v-if="!(btnIndex === 0 || btnIndex === 1)">
          <span class="iconfont icon-db_plus" @click="btnClick(index, 0)"></span>
          <span class="iconfont icon-db_plus" @click="btnClick(index, 1)"></span>
        </div>
      </div>
      <div class="item-bottom" :class="index === activeIdx ? 'active-color' : 'normal-color'">
        <span><span>{{index === 0 ? ($attrs.leftOpen ? '(' : '[') : '('}}</span>{{item[0]}}</span>
        <span><span></span>{{item[1]}} {{index === len - 1 ? ($attrs.rightOpen ? ')' : ']') : ']'}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      len: 0
    };
  },
  props: {
    btnIndex: {
      type: Number,
      default: 3
    },
    list: {
      type: Array
    },
    activeIdx: {
      type: Number
    }
  },
  mounted () {
    this.len = this.list.length;
  },
  methods: {
    changeHandler () {},
    btnClick (idx, index) {
      if (this.btnIndex === index) return;
      this.$emit('btn-click', idx, index);
    }
  }
};
</script>
<style lang='scss' scoped>
.binning-panel {
  .item {
    width: 100%;
    height: 68px;
    border-radius: 4px;
    background: #333333;
    border: 1px solid #444444;
    margin-bottom: 8px;
    color: #fff;
    .item-top {
      height: 30px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #2B2B2B;
      position: relative;
      border-radius: 4px 4px 0px 0px;
      .left-icon {
        display: inline-block;
        height: 8px;
        width: 8px;
        margin: 0px 8px;
        background: linear-gradient(0deg, #EDDE5D 0%, #F09819 100%);
      }
      .no-operate-icon {
        display: inline-block;
        height: 4px;
        width: 4px;
        margin: 0px 8px;
        background: #444444;
      }
      .btns {
        width: 72px;
        position: absolute;
        font-size: 12px;
        right: 16px;
        display: flex;
        align-items: center;
        cursor: pointer;
        >span {
          display: inline-block;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #444444;
          text-align: center;
          font-size: 12px;
          margin: 0px 8px;
          position: relative;
          &::before {
            position: absolute;
            left: 4px;
            top: 4px;
          }
          &:nth-child(1) {
            color: #F6B421;
          }
          &:nth-child(2) {
            display: inline-block;
            transform: rotate(45deg);
            color: #EF635C;
          }
        }
      }
    }
    .item-bottom {
      width: 100%;
      height: 36px;
      display: flex;
      align-items: center;
      >span{
        display: inline-block;
        width: 50%;
        margin-left: 24px;
      }
    }
    &:last-child {
      .btns {
        >span:last-child{
          display: none;
        }
      }
    }
  }
  .active {
    border-color: #555555;
  }
  .no-pointer {
    cursor: not-allowed;
    pointer-events: none;
  }
  .normal-color {
    color: #A4A4A4;
  }
  .active-color {
    color: #fff;
  }
}
</style>
