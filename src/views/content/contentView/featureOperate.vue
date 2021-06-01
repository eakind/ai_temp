<template>
  <div class="feature-operate">
    <div class="top-box">
      <div class="switch-box">
        当前特征
        <el-switch class="switch" v-model="displayValue" active-color="#222222" inactive-color="#333333" @change="changeHandler"></el-switch>
        <span>{{ displayValue ? '显示' : '隐藏'}}</span>
      </div>
      <div class="tips">当前特征可操作</div>
      <div class="btn-box">
        <div class="btn" v-for="(item, index) in btnList" :key="index" @click="operateClick(index)">
          <span class="iconfont" :class="item.icon"></span>
          {{ item.text }}
        </div>
        <div class="btn" v-if="selectedFeature && selectedFeature.status === 'BINNING'" @click="operateClick(3)">
          <span class="iconfont icon-dbc_chainoff"></span>
          分箱调整
        </div>
      </div>
    </div>
    <div class="bottom-box">
      <div class="switch-box">批量操作特征</div>
      <div class="btn-box">
        <div class="btn" @click="operateClick(4)">
          <span class="iconfont icon-dbc_chainoff"></span>
          分箱操作
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { post } from '@/api/server';
export default {
  data () {
    return {
      displayValue: true,
      btnList: [{
        icon: 'icon-db_edit',
        text: '特征修改'
      }, {
        icon: 'icon-db_refresh',
        text: '转换特征'
      }, {
        icon: 'icon-db10_calculate',
        text: '特征交互'
      }]
    };
  },
  computed: {
    ...mapState(['projectId', 'modelType']),
    ...mapState('content', ['selectedBinning', 'selectedFeature', 'targetFeature'])
  },
  watch: {
    'selectedFeature.hidden': {
      handler (val) {
        if (val) {
          this.displayValue = false;
        } else {
          this.displayValue = true;
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
  },
  methods: {
    operateClick (index) {
      if (index === 4) {
        if (!this.targetFeature && this.modelType !== 'CLUSTERING') {
          this.$message({
            message: '请先设置目标特征',
            type: 'warning'
          });
          return;
        }
      };
      this.$emit('on-operate', index);
    },
    async changeHandler (val) {
      this.displayValue = val;
      let params = {
        feature_idx: this.selectedFeature.feature_idx,
        project_id: this.projectId,
        hidden: !this.displayValue
      };
      let res = await post('featureHidden', params);
      this.bus.$emit('refreshFeatureList');
      if (res.code === 0) {
        this.bus.$emit('refreshFeatureList');
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.feature-operate {
  padding: 8px;
  font-size: 14px;
  color: #fff;
  .top-box {
    padding: 8px 16px;
    width: 264px;
    height: 136px;
    border-radius: 4px;
    background: #333333;
    .switch {
      padding: 0px 12px;
    }
  }
  .bottom-box {
    padding: 8px 16px;
    width: 264px;
    height: 72px;
    border-radius: 4px;
    background: #333333;
    margin-top: 12px;
  }
  .tips {
    font-size: 12px;
    color: #A4A4A4;
    margin-top: 8px;
  }
  .btn-box {
    display: flex;
    flex-wrap: wrap;
  }
  .btn {
    padding-left: 30px;
    height: 30px;
    line-height: 30px;
    width: 88px;
    text-align: center;
    border-radius: 20px 4px 4px 20px;
    background: linear-gradient(90deg, #282828 0%, #2e2e2e 100%);
    position: relative;
    cursor: pointer;
    margin: 8px 0px;
    &:nth-child(odd) {
      margin-right: 24px;
    }
    .iconfont {
      height: 16px;
      line-height: 16px;
      width: 30px;
      border-radius: 7px;
      font-size: 14px;
      position: absolute;
      left: 0px;
      top: 7px;
    }
    &::before {
      content: '';
      height: 30px;
      width: 30px;
      border-radius: 50%;
      position: absolute;
      background: linear-gradient(180deg, #F6B421 0%, #483F2A 30%, #483F2A 80%, #F6B421 100%);
      left: 0;
    }
  }
}
</style>
<style lang='scss'>
.el-switch__core {
  border: 1px solid #fff !important;
  height: 16px;
  &::after {
    background: #F6B421;
    height: 18px;
    width: 18px;
    top: -2px;
  }
}
</style>
