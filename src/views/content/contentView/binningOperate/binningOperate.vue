<template>
  <Dialog title="分箱操作" :isShow='binningFlag' @cancel='cancelHandler' @confirm="confirmHandler">
    <binning-feature v-if="currentIndex === 0" @on-next="next" @on-cancel="cancelHandler"></binning-feature>
    <binning-setting v-if="currentIndex === 1" @on-pre="pre" @on-next="next" @on-cancel="cancelHandler"></binning-setting>
    <binning-methods v-if="currentIndex === 2" @on-confirm="confirm" @on-cancel="cancelHandler" @on-pre="pre"></binning-methods>
    <!-- <div class="btns">
      <span class="next-btn" @click="next(1)" v-if="currentIndex === 0">下一步</span>
      <span class="next-btn" @click="pre(0)" v-if="currentIndex === 1">上一步</span>
      <span class="next-btn" @click="next(2)" v-if="currentIndex === 1">下一步</span>
      <span class="next-btn" @click="pre(1)" v-if="currentIndex === 2">上一步</span>
      <span class="next-btn" v-if="currentIndex === 2">执行分箱</span>
      <span class="cancel-btn" @click="cancelHandler">取消</span>
    </div> -->
  </Dialog>
</template>
<script>
import Dialog from '@/components/dialog/index.vue';
import BinningFeature from './binningFeature.vue';
import BinningSetting from './binningSetting.vue';
import BinningMethods from './binningMethods.vue';
import { mapState, mapMutations } from 'vuex';
export default {
  data () {
    return {
      currentIndex: 0
    };
  },
  components: {
    Dialog,
    BinningFeature,
    BinningSetting,
    BinningMethods
  },
  computed: {
    ...mapState('content', ['binningAutoParams'])
  },
  props: {
    binningFlag: {
      type: Boolean,
      default: false
    }
  },
  beforeDestroy () {
  },
  mounted () {
    Object.keys(this.binningAutoParams).forEach(key => {
      this.binningAutoParams[key] = '';
    });
    this.binningAutoParams.feature_idxs = [];
    this.binningAutoParams.binning_type = 'unsuperviser';
    this.binningAutoParams.n_bins = 2;
  },
  methods: {
    ...mapMutations('content', ['setBinningAutoParams']),
    next (value) {
      this.currentIndex = value;
    },
    pre (index) {
      this.currentIndex = index;
    },
    confirm () {
      this.$emit('binning-confirm');
    },
    cancelHandler () {
      this.$emit('on-cancel');
    },
    confirmHandler () {
      this.$emit('on-confirm');
    }
  }
};
</script>
<style lang='scss' scoped>
.tips {
  padding: 8px 0px;
  color: #A4A4A4;
  font-size: 12px;
  >span {
    text-decoration: underline;
    color: #F6B421;
  }
}
.search-input {
  width: 100%;
}
.select-box {
  max-height: 306px;
  overflow-y: auto;
  overflow-x: hidden;
}
.btns {
  margin-top: 14px;
  line-height: 46px;
  display: flex;
  justify-content: center;
  >span {
    display: inline-block;
    width: 80px;
    margin: 0px 20px;
    cursor: pointer;
  }
  .next-btn {
    color: #F6B421;
  }
  .cancel-btn {
    color: #A4A4A4;
  }
}
</style>
<style lang='scss'>
.select-box {
  .el-checkbox {
    width: 100%;
    line-height: 32px;
    background: #333333;
    border-radius: 4px;
    margin-top: 8px;
    padding: 0px 8px;
    box-sizing: border-box;
    &:hover {
      border: 1px solid #026BDB;
    }
  }
  .all-checkbox {
    background: none;
    &:hover {
      border: none;
    }
  }
}
</style>
