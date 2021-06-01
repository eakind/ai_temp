<template>
  <div class="search-input">
    <span class="iconfont icon-db_magify"></span>
    <input :placeholder="inputTip || '搜索'" v-model.trim="inputVal" />
    <span class="iconfont icon-db_plus" v-if="inputVal && !noIcon" @click="clearHandler"></span>
  </div>
</template>
<script>
export default {
  data () {
    return {
      inputVal: '',
      timer: null
    };
  },
  props: {
    inputTip: {
      type: String,
      default: ''
    },
    inputValue: {
      type: String
    },
    noIcon: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    inputVal (val) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.changeHandler();
      }, 500);
    },
    inputValue (val) {
      if (val === this.inputVal) return;
      this.inputVal = val;
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    changeHandler () {
      this.$emit('change', this.inputVal);
    },
    clearHandler () {
      this.inputVal = '';
      this.$emit('clear');
    }
  }
};
</script>
<style lang='scss' scoped>
.search-input {
  display: inline-block;
  width: 264px;
  height: 36px;
  line-height: 36px;
  background: #333333;
  border-radius: 4px;
  text-align: left;
  box-sizing: border-box;
  position: relative;
  .icon-db_magify {
    width: 30px;
    position: relative;
    padding: 0px 12px;
    font-size: 18px;
    box-sizing: border-box;
    color: #F6B421;
  }
  > input {
    padding: 0px 3px;
    margin: 0px;
    height: 100%;
    box-sizing: border-box;
    width: calc(100% - 50px);
    outline: none;
    border: none;
    font-size: 14px;
    background-color: transparent;
    position: absolute;
    color: #fff;
  }
  .icon-db_plus{
    width: 30px;
    transform: rotate(45deg);
    display: inline-block;
    right: -5px;
    top: 15%;
    cursor: pointer;
    position: absolute;
    color: #F6B421;
  }
}
</style>
