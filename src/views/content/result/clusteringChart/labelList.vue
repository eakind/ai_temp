<template>
  <div class="group-list">
    <div
      class="list-item"
      :class="[hasSelectLabel, selectLabel.name !== item.name ? 'no-active' : '']"
      v-for="(item, index) in labelList"
      :key="index"
    >
      <span
        class="circle"
        :style="{ background: item.color }"
        @click="selectLabelHandler(item)"
      ></span>
      {{ item.name }}
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
export default {
  data () {
    return {};
  },
  computed: {
    ...mapState('result', ['labelList', 'selectLabel']),
    hasSelectLabel () {
      if (!this.selectLabel.name) return 'is-active';
      return '';
    }
  },
  components: {},
  mounted () {
  },
  methods: {
    ...mapMutations('result', ['setSelectLabel']),
    selectLabelHandler (item) {
      if (this.selectLabel.name && this.selectLabel.name === item.name) {
        this.setSelectLabel({});
      } else {
        this.setSelectLabel(item);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.group-list {
  width: 100px;
  height: 100%;
  padding-left: 10px;
  box-sizing: border-box;
  overflow: hidden auto;
  .list-item {
    height: 22px;
    line-height: 22px;
    margin: 4px 0px;
    cursor: pointer;
    padding-left: 22px;
    position: relative;
  }
  .circle {
    width: 18px;
    height: 18px;
    border-radius: 20px;
    background-color: red;
    display: inline-block;
    position: absolute;
    left: 0px;
  }
  .is-active{
    opacity: 1!important;
    .circle {
      opacity: 1!important;
    }
  }
  .no-active {
    opacity: 0.5;
    .circle {
      opacity: 0.5;
    }
  }
}
</style>
