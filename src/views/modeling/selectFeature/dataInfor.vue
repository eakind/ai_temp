<template>
  <Dialog title="数据信息" :isShow='dialogFag' :width='dialogWidth' :showBtn="false" :hasPadding="false" @cancel='cancelHandler' @confirm="confirmHandler">
    <normal-infor></normal-infor>
    <binning-info v-if="false"></binning-info>
    <div class="btn" @click="cancelHandler">关闭</div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/dialog/index.vue';
import NormalInfor from '../selectFeature/normalInfor.vue';
import binningInfo from './binningInfo.vue';
export default {
  data () {
    return {
      // dialogWidth: '1278'
      dialogWidth: 768
    };
  },
  props: {
    dialogFag: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Dialog,
    NormalInfor,
    binningInfo
  },
  methods: {
    confirmHandler () {},
    cancelHandler () {
      this.$emit('cancel');
    }
  }
};
</script>
<style lang='scss' scoped>
.btn {
  font-size: 14px;
  color: #F6B421;
  text-align: center;
  margin-top: 16px;
  cursor: pointer;
}
</style>
