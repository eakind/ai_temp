<template>
  <div class="list">
    <div class="header">
      <span>{{ list.project_name }}</span>
      <span @click="enterHandler(list)">进入</span>
    </div>
    <div class="content">
      <div class="type-name">
        {{ setModelName(list.model_type) }}
        <img :src="setImg(list.model_type)" width="60px" alt="">
      </div>
      <div class="file-name">{{ list.file_name }}</div>
      <div class="create-time">创建于{{ list.insert_time }}</div>
    </div>
    <div class="file-type">
      <span class="processing-style"></span>
      <span class="processing-blur"></span>
      <span class="type">{{ setStatus(list.status) }}</span>
    </div>
    <div class="more" @click="clickMore">
      <span class="circle"></span>
      更多操作
    </div>
    <operate-panel v-if="operateFlag" :list="list" @exit="exitHandler" @on-rename="renameHandler" @on-del="delHandler" @on-log="logHandler"></operate-panel>
  </div>
</template>
<script>
import OperatePanel from './operatePanel.vue';
import { post } from '@/api/server';
import { mapMutations } from 'vuex';
export default {
  data () {
    return {
      operateFlag: false
    };
  },
  props: {
    list: {
      type: Object
    }
  },
  components: {
    OperatePanel
  },
  computed: {
  },
  methods: {
    ...mapMutations(['setProjectId']),
    setStatus (status) {
      if (status === 'UPLOADING') {
        return '上传';
      } else if (status === 'UPLOADED') {
        return '分析';
      } else if (status === 'PROCESSING') {
        return '建模';
      } else if (status === 'ANALYZING') {
        return '分析';
      } else if (status === 'PROCESSED') {
        return '建模';
      }
    },
    setModelName (modelType) {
      if (modelType === 'BINARY_CLASS') {
        return '分类';
      } else if (modelType === 'REGRESSION') {
        return '回归';
      } else if (modelType === 'SCORECARD') {
        return '评分';
      } else if (modelType === 'GLM_BINARY_CLASS') {
        return 'GLM分类';
      } else if (modelType === 'GLM_REGRESSION') {
        return 'GLM回归';
      } else if (modelType === 'CLUSTERING') {
        return '聚类';
      } else {
        return '未知';
      }
    },
    setImg (modelType) {
      if (modelType === 'CLASSIFY') {
        return `${require('@/assets/class.png')}`;
      } else if (modelType === 'REGRESSION') {
        return `${require('@/assets/gem.png')}`;
      } else if (modelType === 'SCORECARD') {
        return `${require('@/assets/score.png')}`;
      } else if (modelType === 'GLM_CLASSIFY') {
        return `${require('@/assets/glmClass.png')}`;
      } else if (modelType === 'GLM_REGRESSION') {
        return `${require('@/assets/glmRem.png')}`;
      } else if (modelType === 'CLUSTERING') {
        return `${require('@/assets/clustering.png')}`;
      } else {
        return `${require('@/assets/class.png')}`;
      }
    },
    enterHandler (item) {
      this.$emit('on-enter', item);
    },
    clickMore () {
      this.operateFlag = true;
    },
    exitHandler () {
      this.operateFlag = false;
    },
    hide () {
      this.operateFlag = false;
    },
    async renameHandler (value) {
      let params = {
        project_id: this.list.project_id,
        project_name: value
      };
      let res = await post('renameProject', params);
      if (res.code === 0) {
        this.operateFlag = false;
        this.$emit('rename', { ...params });
      }
    },
    async delHandler () {
      let param = {
        project_id: this.list.project_id
      };
      let res = await post('delProject', param);
      if (res.code === 0) {
        this.operateFlag = false;
        this.$emit('deled');
      }
    },
    logHandler () {
      this.$emit('log-detail');
    }
  }
};
</script>
<style lang='scss' scoped>
@mixin circle {
  width: 4px;
  height: 4px;
  border-radius: 100px;
  background: rgba($color: #fff, $alpha: 0.9);
  display: inline-block;
}
.list {
  height: 240px;
  width: 360px;
  box-sizing: border-box;
  border-radius: 4px;
  background: #2B2B2B;
  color: #fff;
  position: relative;
  .header {
    padding-left: 16px;
    height: 40px;
    line-height: 40px;
    width: calc(100% - 16px);
    border-radius: 4px 4px 0px 0px;
    background: #333333;
    font-size: 16px;
    font-weight: bold;
    position: relative;
    >span:first-child {
      background: linear-gradient(90deg, #89F7FE 0%, #66A6FF 100%);
      background-clip: text;
      color: transparent;
    }
    >span:nth-child(2) {
      position: absolute;
      right: 0px;
      top: 8px;
      height: 24px;
      line-height: 24px;
      width: 64px;
      text-align: center;
      opacity: 0.9;
      border-radius: 4px 0px 0px 4px;
      font-size: 14px;
      cursor: pointer;
      background: linear-gradient(0deg, #89F7FE 0%, #66A6FF 100%);
    }
    &::before {
      content: '';
      height: 4px;
      width: 10px;
      border-radius: 0px 4px 4px 0px;
      position: absolute;
      top: 19px;
      left: 0px;
      background: linear-gradient(90deg, #89F7FE 0%, #66A6FF 100%);
    }
  }
  .content {
    padding: 0px 16px;
    font-size: 12px;
    .type-name {
      position: relative;
      line-height: 40px;
      margin: 8px 0px;
      >img {
        position: absolute;
        left: -15px;
        top: -8px;
      }
    }
    .file-name {
      opacity: 0.9;
    }
    .create-time {
      opacity: 0.9;
      padding: 16px 0px;
    }
  }
  .file-type {
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    background: linear-gradient(90deg, #222222 0%, #2a2a2a 100%);
    position: relative;
    .type {
      margin-left: 32px;
      color: #FFFFFF;
    }
    .processing-style {
      display: inline-block;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      border: 1px solid #fff;
      position: absolute;
      top: 15px;
      left: 15px;
    }
    .processing-blur {
      display: inline-block;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      border: 1px solid #026BDB;
      filter: blur(2px);
      position: absolute;
      top: 15px;
      left: 15px;
    }
  }
  .more {
    line-height: 35px;
    padding: 0px 16px;
    opacity: 0.8;
    display: flex;
    justify-content: flex-end;
    cursor: pointer;
    position: relative;
    .circle {
      @include circle;
      right: 85px;
      top: 15px;
      position: absolute;
      &::before {
        left: 0px;
        top: -6px;
        content: '';
        @include circle;
        position: absolute;
      };
      &::after {
        left: 0px;
        top: 6px;
        content: '';
        @include circle;
        position: absolute;
      }
    }
  }
}
</style>
