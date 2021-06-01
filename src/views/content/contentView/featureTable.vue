<template>
  <div class="feature-table">
    <div class="table-header">
      <div class="item" :style="{width: width}" v-for="(item, hIdx) in headerTitle" :key="hIdx">
        {{ item }}
      </div>
    </div>
    <scroll-list class="table-body" @loadMore="loadMore">
      <template>
        <div class="body-list" :class="[selectedFeature.feature_idx === item.feature_idx ? 'selected-style' : '', item[headerArr[headerArr.length - 1]] ? 'hidden-style' : '']"  v-for="(item, tIdx) in tableData" :key="tIdx" @click="selectData(item)">
          <template v-for="(childrenItem, cIdx) in headerArr">
            <div class="item item-color" :style="`width: ${ width }`" :key="cIdx" v-if="tableType === 'special' && cIdx !== headerArr.length - 1">
              <span :class="setColor(item[childrenItem])">
                <span class="hidden-tips" v-if="cIdx === 1 && item[headerArr[headerArr.length - 1]]">隐藏</span>
                {{ childrenItem === 'status' ? setStatusName(item[childrenItem]) : item[childrenItem]}}
              </span>
            </div>
            <div class="item item-color" :style="`width: ${ width }`" :key="cIdx" v-if="tableType !== 'special'">
              <span :class="setColor(item[childrenItem])">
                <span class="hidden-tips" v-if="cIdx === 1 && item[headerArr[headerArr.length - 1]]">隐藏</span>
                {{ childrenItem === 'status' ? setStatusName(item[childrenItem]) : item[childrenItem]}}
              </span>
            </div>
          </template>
        </div>
      </template>
    </scroll-list>
    <div class="no-modify-mask" :style="{'left': width, 'width': mWidth, 'height': mHeight}" v-if="refreshFlag">
      <div v-if="refreshCode === 0">刷新中，请等待计算结果，确认无误后，再点击执行调整。</div>
      <div v-if="refreshCode === 0">刷新过程无法再调整分箱。如需取消，请在任务进程中取消本次计算进程。</div>
      <div v-if="refreshCode === 1">分箱已修改，请刷新计算，确认无误后执行分箱。</div>
    </div>
  </div>
</template>
<script>
import ScrollList from '@/components/scrollList/index.vue';
import { mapState } from 'vuex';
export default {
  data () {
    return {
    };
  },
  components: {
    ScrollList
  },
  props: {
    headerTitle: {
      type: Array
    },
    tableData: {
      type: Array
    },
    refreshFlag: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    },
    headerArr: {
      type: Array
    },
    refreshCode: {
      type: Number,
      default: 1
    },
    tableType: {
      type: String,
      default: 'normal'
    }
  },
  computed: {
    ...mapState('content', ['selectedFeature']),
    width () {
      if (this.type === 'binning') {
        let len = this.headerTitle.length;
        if (len !== 0) {
          if (len > 5) {
            let w = `${100 / len}%`;
            return w;
          } else {
            let w = `${100 / len}%`;
            return w;
          }
        }
        return '100%';
      } else {
        return '10%';
      }
    },
    mWidth () {
      let len = this.headerTitle.length;
      let num = Number(this.headerTitle.length - 1) < 0 ? 0 : Number(this.headerTitle.length - 1);
      if (len !== 0) {
        let w = `${100 / len}`;
        return `${w * num}%`;
      }
      return '100%';
    },
    mHeight () {
      let len = Number(this.tableData.length);
      if (len !== 0) {
        return `${42 * len}px`;
      }
      return '100%';
    }
  },
  mounted () {
  },
  methods: {
    setStatusName (val) {
      let str = '';
      switch (val) {
        case 'BINNING':
          str = '分箱';
          break;
        case 'RAW':
          str = '原数据';
          break;
        case 'FORMULA':
          str = '特征交互';
          break;
        case 'NONE':
          str = '特征修改';
          break;
        case 'CONVERT':
          str = '特征修改';
          break;
        case 'DUMMY':
          str = '特征转换';
          break;
      }
      return str;
    },
    setColor (value) {
      if (value === 'BINNING') {
        return 'active-color';
      }
    },
    loadMore () {
      this.$emit('on-more');
    },
    selectData (item) {
      this.$emit('select-data', item);
    }
  }
};
</script>
<style lang='scss' scoped>
.feature-table {
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #fff;
  position: relative;
  .table-header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #333;
    border-radius: 4px;
    display: flex;
  }
  .body-list {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #333;
    border-radius: 4px;
    display: flex;
    margin-bottom: 8px;
    box-sizing: border-box;
    &:hover {
      border: 1px solid #026BDB;
    }
  }
  .hidden-style {
    background: none;
  }
  .selected-style {
    border: 1px solid #F6B421;
  }
  .item {
    height: 40px;
    line-height: 40px;
    width: 10%;
    padding: 0px 8px;
    color: white;
    background: linear-gradient(90deg, #89F7FE 0%, #66A6FF 100%);
    background-clip: text;
    color: transparent;
    font-weight: bold;
    box-sizing: border-box;
    cursor: pointer;
    text-align: center;
    box-sizing: border-box;
    .hidden-tips {
      display: inline-block;
      height: 18px;
      line-height: 18px;
      width: 40px;
      border-radius: 4px;
      background: #444;
      text-align: center;
      font-size: 12px;
    }
    &:nth-child(2){
      text-align: left;
    }
    @include ellipsis;
    // &:nth-child(2) {
    //   width: 20%;
    // }
  }
  .item-color {
    color: #fff;
    font-weight: normal;
  }
  .table-body {
    width: 100%;
    height: calc(100% - 40px);
    margin-top: 8px;
    overflow-y: auto;
    @include scrollBar(#a4a4a4, 0px);
  }
  .no-modify-mask {
    top: 44px;
    left: 16%;
    height: calc(100% - 40px);
    width: 84%;
    pointer-events: none;
    position: absolute;
    background: rgba($color: #222222, $alpha: 0.9);
    z-index: 1;
    >div {
      font-size: 12px;
      padding: 8px;
    }
  }
  .active-color {
    color: white;
    background: linear-gradient(90deg, #89F7FE 0%, #66A6FF 100%);
    background-clip: text;
    color: transparent;
  }
}
</style>
