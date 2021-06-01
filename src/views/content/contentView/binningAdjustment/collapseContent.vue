<template>
  <div class="collapse-content">
    <el-collapse v-model="activeNames">
      <template  v-for="(item, index) in list">
        <el-collapse-item :name="index"  :key="index">
          <template slot="title">
            <div class="btns" v-if="btnIndex === 3 && !item.includes('_others')">
              <span class="iconfont icon-db_plus" @click.stop="btnClick(item, index, 0)"></span>
              <span class="iconfont icon-db_minus" @click.stop="btnClick(item, index,1)"></span>
              <span class="iconfont icon-db_plus" @click.stop="btnClick(item, index,2)"></span>
            </div>
            <div class="btns" v-if="btnIndex !== 3 && index === activeIdx" @click.stop="btnClick(item,index, 3)">
              <span class="iconfont icon-db_arrow"></span>收起编辑
            </div>
            <span v-if="item.length === 0 && addIdx">（未添加）</span>
            <span class=title :class="index === activeIdx ? 'active-color' : 'normal-color'">箱体{{ index+1}}</span>
            <span :class="index === activeIdx ? 'left-icon' : 'no-operate-icon'"></span>
          </template>
          <div class="content">
            <template v-if="item.length > 0">
              <div class="item" v-for="(childrenItem, cIdx) in item" :key="cIdx">- {{ childrenItem }}</div>
            </template>
            <template v-if="item.length === 0 && addIdx">
              <div class="tips">
                选择数据并收起编辑后，箱体才会添加到当前设置
              </div>
            </template>
            <template v-if="item.length === 0 && !addIdx">
              <div class="warning-style">
                未添加数据
              </div>
            </template>
          </div>
        </el-collapse-item>
      </template>
    </el-collapse>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeNames: []
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
    },
    addIdx: {
      type: Number
    }
  },
  watch: {
    addIdx: {
      handler (val) {
        if (val) {
          this.activeNames.push(val);
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
  },
  methods: {
    changeHandler () {},
    btnClick (item, idx, index) {
      if (this.btnIndex === index) return;
      this.$emit('btn-click', item, idx, index);
    }
  }
};
</script>
<style lang='scss' scoped>
.collapse-content {
  .left-icon {
    height: 8px;
    width: 8px;
    background: linear-gradient(0deg, #EDDE5D 0%, #F09819 100%);
  }
  .no-operate-icon {
    display: inline-block;
    height: 4px;
    width: 4px;
    margin: 0px 8px;
    background: #444444;
  }
  .title {
    padding-left: 8px;
  }
  .btns {
    position: absolute;
    font-size: 12px;
    right: 16px;
    display: flex;
    align-items: center;
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
        top: -5px;
      }
      &:nth-child(1) {
        color: #F6B421;
         transform: rotate(180deg);
      }
      &:nth-child(3) {
        color: #EF635C;
        transform: rotate(45deg);
      }
    }
  }
  .content {
    min-height: 32px;
    max-height: 200px;
    overflow-y: auto;
    @include scrollBar(#a4a4a4, 0px);
    border-left: 1px solid #444444;
    .item {
      line-height: 36px;
    }
    .tips {
      font-size: 12px;
      color: #a4a4a4;
      padding-left: 24px;
    }
    .warning-style {
      font-size: 12px;
      padding-left: 24px;
      color: #EF635C;
      line-height: 28px;
    }
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
<style lang='scss'>
.collapse-content {
  .el-collapse-item__header {
    border: 1px solid #444444;
    background: #333;
    color: #fff;
    position: relative;
  }
  .el-collapse-item__content {
    background: none;
    padding-top: 0px;
    padding-bottom: 0px;
  }
}
</style>
