<template>
  <div class="drop-list" v-click-out="hide" @click="showList=!showList">
    <span class="iconfont icon-db_arrow" :class="showList ? 'rotated' : ''" @click.stop="showList=!showList" v-if="positionType === 'left'"></span>
    <span class="iconfont icon-db_arrow" :class="showList ? 'rotated' : ''" @click.stop="showList=!showList" v-if="positionType === 'other'"></span>
    <span class="selected-name">{{ selected }}</span>
    <span class="triangle" :class="showList ? 't-rotated' : ''" v-if="positionType === 'right'"></span>
    <div class="list-panel" :class="positionType === 'left' ? 'centerStyle' : ''" v-if="showList && type !== 'methods'">
      <div class="list" v-for="(item, index) in list" :key="index" :class="selected===item.name ? 'item-active' : ''" v-show="item.name !== filter" @click="selectHandler(item)">
        {{ item.name }}
      </div>
    </div>
    <div class="list-panel" :class="positionType === 'left' ? 'centerStyle' : ''" v-if="showList && type === 'methods'">
      <div class="list" @click="selectOperateHandler({}, {})">不使用</div>
      <div v-for="(item, idx) in list" :key="idx">
        <div class="list" :class="selected===item.selectName.name ? 'item-active' : ''" @click="selectOperateHandler(item.selectName, item)">{{ item.selectName.name }}</div>
        <div class="list padding-style" v-for="(childItem, cIdx) in item.funArr" :key="cIdx" :class="selected===childItem.name ? 'item-active' : ''"
          v-show="item.name !== filter" @click="selectOperateHandler(childItem, item)">
          {{ childItem.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      selected: this.select,
      showList: false
    };
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      }
    },
    select: {
      type: [String, Number],
      default: ''
    },
    positionType: {
      type: String,
      default: 'right'
    },
    type: {
      type: String
    },
    filter: {
      type: String,
      default: ''
    }
  },
  watch: {
    select (val) {
      this.selected = val;
    }
  },
  methods: {
    hide () {
      this.showList = false;
    },
    selectHandler (item) {
      if (this.type === 'methods' && JSON.stringify(item) === '{}') {
        this.selected = '请选择';
      } else {
        this.selected = item.name;
      }
      this.$emit('on-change', item);
    },
    selectOperateHandler (item, list) {
      if (this.type === 'methods' && JSON.stringify(item) === '{}') {
        this.selected = '请选择';
        this.$emit('on-change', {}, list);
      } else {
        this.selected = item.name;
        this.$emit('on-change', item, list);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.drop-list {
  width: 120px;
  height: 36px;
  line-height: 36px;
  display: inline-block;
  text-align: left;
  position: relative;
  background: #333333;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  .icon-db_arrow {
    display: inline-block;
    transform: rotate(90deg);
    color: #F6B421;
  }
  .triangle {
    width:0;
    height:0;
    border-right:6px solid transparent;
    border-left:6px solid transparent;
    border-top:6px solid #fff;
    position: absolute;
    right: 15px;
    top: 15px;
  }
  .selected-name {
    display: inline-block;
    height: 100%;
    margin-left: 15px;
  }
  .rotated {
    transform: rotate(90deg);
  }
  .t-rotated {
    transform: rotate(180deg);
  }
  .list-panel {
    width: 100%;
    max-height: 230px;
    overflow-y: auto;
    background: #333333;
    position: absolute;
    font-size: 14px;
    padding: 5px 0px;
    z-index: 100;
    @include scrollBar(#a4a4a4, 5px);
    .list {
      cursor: pointer;
      padding-left: 15px;
      text-align: left;
      line-height: 32px;
      &:hover {
        background: #666666;
      }
    }
    .item-active {
      color: #F6B421;
    }
    .padding-style {
      padding-left: 32px;
    }
  }
  .centerStyle {
    >div {
      text-align: center;
      padding-left: 0px;
    }
  }
}
</style>
