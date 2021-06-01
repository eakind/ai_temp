<template>
  <div class="select-input" v-click-out="hide">
    <div class="input-box" @click="showList=!showList">
      {{ selected }}
      <span class="triangle" :class="showList ? 't-rotated' : ''"></span>
    </div>
    <div class="select-panel" v-if="showList">
      <search-input class="search-box" @change="changekeyWord" :inputValue='keyWord'></search-input>
      <scroll-list class="scroll-list" @loadMore="loadMore">
        <div class="list" @click="selectHandler('{}', 0)">请选择</div>
        <div class="list" v-for="(item, index) in list" :key="index"
         @click="selectHandler(item, index + 1)" :class="[setActive(item)]">
          {{ item.feature_name }}
        </div>
      </scroll-list>
    </div>
  </div>
</template>
<script>
import SearchInput from '@/components/searchInput/index.vue';
import ScrollList from '@/components/scrollList/index.vue';
export default {
  data () {
    return {
      keyWord: '',
      showList: false,
      selectIndex: 0,
      selected: this.select
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
    }
  },
  components: {
    SearchInput,
    ScrollList
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    setActive (item) {
      if (item.feature_name === this.selected) {
        return 'active';
      } else {
        return '';
      }
    },
    selectHandler (item, index) {
      this.showList = false;
      if (index !== 0) {
        this.selected = item.feature_name;
        this.$emit('on-change', item, index);
      } else {
        this.selected = '请选择';
        this.$emit('on-change', {}, index);
      }
    },
    hide () {
      this.showList = false;
    },
    changekeyWord (val) {
      this.$emit('change-keyWord', val);
    },
    loadMore () {
      this.$emit('load-more');
    }
  }
};
</script>
<style lang='scss' scoped>
.select-input {
  width: 168px;
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  background: #333333;
  padding: 0px 12px;
  position: relative;
  cursor: pointer;
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
  .t-rotated {
    transform: rotate(180deg);
  }
}
.select-panel {
  padding: 8px;
  width: 192px;
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
  background: #333333;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
  text-align: left;
  box-sizing: border-box;
  position: absolute;
  left: 0px;
  top: 38px;
  z-index: 1;
  @include scrollBar(#a4a4a4, 5px);
  .search-box {
    width: 100%;
  }
  .list {
    line-height: 32px;
    width: calc(100% -16px);
    border-radius: 4px;
    background: #333333;
    padding: 0px 8px;
    margin-top: 8px;
    &:hover {
      border: 1px solid #026BDB;
    }
  }
  .active {
    border: 1px solid #F6B421;
    color: #F6B421;
  }
}
</style>
