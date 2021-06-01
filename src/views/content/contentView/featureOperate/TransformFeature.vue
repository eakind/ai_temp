<template>
  <Dialog title="转换特征" :isShow='transformFlag' :hasPadding="false" :showBtn="true" @cancel='cancelHandler' @confirm="confirmHandler">
    <div class="tips">修改特征类型或进行缺失填充。</div>
    <div class="panel-box">
      <div class="item">
        <div class="name bottom-line rename-box">命名新特征</div>
        <input type="text" v-model="newFeaName" placeholder="请输入新特征名称">
      </div>
      <div class="bottom-line">转换操作</div>
      <div class="bottom-tips">
        当前特征支持转换为分类变量。
        <span v-if="selectedFeature && selectedFeature.unique_num > 30">维数大于30，请先离散化降低维数。</span>
      </div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/dialog/index.vue';
import { post } from '@/api/server';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      newFeaName: ''
    };
  },
  components: {
    Dialog
  },
  props: {
    transformFlag: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['projectId']),
    ...mapState('content', ['selectedFeature', 'targetFeature'])
  },
  mounted () {
    this.newFeaName = this.selectedFeature.feature_name;
  },
  methods: {
    cancelHandler () {
      this.$emit('on-cancel');
    },
    confirmHandler () {
      // this.$showMessageBox({
      //   title: '转换特征',
      //   message: '此操作不可撤销，确定转换特征？',
      //   center: true,
      //   show: true,
      //   cb: this.modifyFeature
      // });
      // this.$emit('on-confirm');
      this.modifyFeature();
    },
    async modifyFeature () {
      this.$closeMessageBox();
      let params = {
        project_id: this.projectId,
        feature_idx: this.selectedFeature.feature_idx,
        feature_name: this.newFeaName,
        converted_type: 'DUMMY'
      };
      let res = await post('featureCreate', params);
      if (res.code === 0) {
        this.$message({
          message: '操作成功。',
          type: 'success'
        });
        this.$emit('on-cancel');
        this.bus.$emit('refreshFeatureList');
        // if (this.targetFeature.feature_idx === this.selectedFeature.feature_idx) {
        //   this.bus.$emit('refresh', res.feature_idx, true);
        // } else {
        //   this.bus.$emit('refresh', res.feature_idx);
        // }
      } else {
        this.$message({
          message: res.msg,
          type: 'warning'
        });
      }
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../style/featureOperate.scss';
</style>
