<template>
  <div class="file-list">
    <div class="top">
      <span class="file-name">{{ list.file_name }}</span>
      <span class="upload" :class="setColor(list.status)">{{ getStatus(list.status) }}</span>
    </div>
    <div class="bottom">
      <span>{{ list.source === 'LOCAL' ? '本地文件' : '历史文件' }}</span>
      <div class="delete" @click="deleteFile(list, index)">
        <span class="iconfont icon-db_plus"></span>
        移除
      </div>
    </div>
  </div>
</template>
<script>
import errorCodeObj from '@/i18n/backend_cn.js';
export default {
  data () {
    return {};
  },
  props: {
    list: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  methods: {
    getStatus (val) {
      if (val === 'active_done') {
        return '上传成功';
      } else if (val === 'active_created') {
        return '上传中';
      } else if (val === 'waiting_created') {
        return '等待中';
      } else if (val === 'error') {
        return '失败';
      } else {
        return errorCodeObj[val];
      }
    },
    setColor (val) {
      if (val === 'active_done') {
        return 'successColor';
      } else if (val === 'active_created') {
        return 'uploadingColor';
      } else if (val === 'waiting_created') {
        return 'waitingColor';
      } else if (val === 'error') {
        return 'errorColor';
      } else {
        return 'successColor';
      }
    },
    deleteFile (list, index) {
      this.$emit('on-del', list, index);
    }
  }
};
</script>
<style lang='scss' scoped>
.file-list {
  padding: 0px 8px;
  width: 100%;
  border-radius: 4px;
  background: #333333;
  color: #fff;
  font-size: 12px;
  .top, .bottom {
    height: 32px;
    line-height: 32px;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .top {
    >span:nth-child(1) {
      position: relative;
      &::after {
        content: '';
        height: 1px;
        width: 320px;
        background: linear-gradient(90deg, #F6B421 0%, #333 100%);
        position: absolute;
        left: -8px;
        bottom: 0px;
      }
    }
    .upload {
      // opacity: 0.5;
    }
  }
  .bottom {
    >span:nth-child(1) {
      opacity: 0.5;
    }
    .icon-db_plus  {
      display: inline-block;
      color: #F62121;
      margin-right: 5px;
      transform: rotate(45deg);
    }
    .delete {
      cursor: pointer;
    }
  }
  .successColor {
    color: #fff;
    opacity: 0.5;
  }
  .uploadingColor {
    color: #F6B421;
    opacity: 1.0;
  }
  .waitingColor {
    color: white;
    background: linear-gradient(90deg, #89F7FE 0%, #66A6FF 100%);
    background-clip: text;
    color: transparent;
  }
  .errorColor {
    color: #F62121;
    opacity: 1.0;
  }
}
</style>
