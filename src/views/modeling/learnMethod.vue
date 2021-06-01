<template>
  <div class="learn-method">
    <div class="title">学习方式</div>
    <div class="tips">请选择对应学习方式。</div>
    <div class="select-panel" :class="modeValue === 'FAST' ? 'isActive' : ''" @click="selectModeType('FAST')">
      <el-radio v-model="modeValue" label="FAST">快速学习</el-radio>
      <div class="mode-tips">最快方法，模型结果仍有较大的优化空间。</div>
    </div>
    <div class="select-panel" :class="modeValue === 'DEEP' ? 'isActive' : ''" @click="selectModeType('DEEP')">
      <el-radio v-model="modeValue" label="DEEP">深度学习</el-radio>
      <div class="mode-tips">最优方法，建模过程中大部分模型都会进行自动调参。建模时间较长，模型结果较好。</div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { get, post } from '@/api/server';
export default {
  data () {
    return {
      modeValue: 'FAST'
    };
  },
  computed: {
    ...mapState(['projectId'])
  },
  activated () {
    this.getModelLearnMethod();
  },
  mounted () {
    this.setModelMethod('FAST');
  },
  methods: {
    ...mapMutations('modeling', ['setModelMethod']),
    async getModelLearnMethod () {
      let params = {
        project_id: this.projectId
      };
      let res = await get('getModelLearnMethod', params);
      if (res.code === 0) {
        if (!res.modeling_method) {
          this.setModelMethod('FAST');
        } else {
          this.setModelMethod(res.modeling_method);
        }
      }
    },
    async postModelLearnMethod () {
      let params = {
        project_id: this.projectId,
        modeling_method: this.modeValue
      };
      let res = await post('postModelLearnMethod', params);
      if (res.code === 0) {
        this.getModelLearnMethod();
      }
    },
    selectModeType (val) {
      this.modeValue = val;
      this.postModelLearnMethod();
    }
  }
};
</script>
<style lang='scss' scoped>
.learn-method{
  padding: 8px 0px;
  color: #fff;
  font-size: 14px;
  height: calc(100% - 170px);
  position: relative;
  .title {
   line-height: 32px;
   position: relative;
   &::before {
     content: '';
     height: 1px;
     width: 26px;
     background: #F6B421;
     position: absolute;
     left: 0px;
     bottom: 0px;
   }
 }
 .tips {
  color: #A4A4A4;
  font-size: 12px;
  line-height: 24px;
  padding: 8px 0px;
  }
  .select-panel {
    padding: 8px 16px;
    height: 56px;
    width: 608px;
    border-radius: 4px;
    background: #333333;
    margin-bottom: 16px;
    cursor: pointer;
    .mode-tips {
      font-size: 12px;
      margin-top: 12px;
      margin-left: 20px;
    }
  }
  .isActive {
    border: 1px solid #F6B421;
  }
}
</style>
