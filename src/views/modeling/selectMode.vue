<template>
  <div class="select-mode">
    <div class="title">选择模式</div>
    <div class="tips">建模时间由建模模式和数据量决定。</div>
    <div class="select-panel" :class="modeValue === 'auto' ? 'isActive' : ''" @click="selectModeType('auto')">
      <el-radio v-model="modeValue" label="auto">自动建模</el-radio>
      <div class="mode-tips">使用默认参数建模，不需要设置任何参数。</div>
    </div>
    <div class="select-panel" :class="modeValue === 'manual' ? 'isActive' : ''" @click="selectModeType('manual')">
      <el-radio v-model="modeValue" label="manual">专家手动</el-radio>
      <div class="mode-tips">进行自定义设置，供有一定建模经验的用户使用。</div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import { get, post } from '@/api/server';
export default {
  data () {
    return {
      modeValue: 'auto'
    };
  },
  computed: {
    ...mapState(['projectId'])
  },
  activated () {
    this.getModelPattrns();
    this.postModelPattrns();
  },
  mounted () {
    this.setModeType('auto');
    // this.postModelPattrns(this.modeValue);
    // this.getModelPattrns();
  },
  methods: {
    ...mapMutations('modeling', ['setModeType']),
    async getModelPattrns () {
      let params = {
        project_id: this.projectId
      };
      let res = await get('getModelPattrns', params);
      if (res.code === 0) {
        if (!res.modeling_patterns) {
          this.setModeType('auto');
        } else {
          let str = res.modeling_patterns === 'AUTO' ? 'auto' : 'manual';
          this.setModeType(str);
        }
      }
    },
    async postModelPattrns () {
      let params = {
        project_id: this.projectId,
        modeling_patterns: this.modeValue === 'auto' ? 'AUTO' : 'MANUAL'
      };
      let res = await post('postModelPattrns', params);
      if (res.code === 0) {
        this.getModelPattrns();
      }
    },
    selectModeType (val) {
      this.modeValue = val;
      this.postModelPattrns();
    }
  }
};
</script>
<style lang='scss' scoped>
.select-mode {
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
