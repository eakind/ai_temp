<template>
  <Dialog title="模型调参" :isShow='dialogFlag' :showBtn="true" @cancel='cancelHandler' @confirm="confirmHandler">
    <div class="tips">“自动”-系统优化配置；“手动”-可自行更改默认配置。</div>
    <div class="model-name">模型名称：{{modelName}}</div>
    <div class="table-box">
      <div class="list-box">
        <span>参数名称</span>
        <span>限定条件/描述</span>
        <span>设置</span>
      </div>
      <scroll-list class="table-body">
        <div class="list-box list" v-for="(item, index) in detailInfor" :key="index">
          <span>{{item.param_name}}</span>
          <span class="limit">{{item.params_str}}</span>
          <div class="setting-box">
            <div class="setting">
              <span :class="item.settings === 'auto' ? 'active' : ''" @click="operate(item, index)">自动</span>
              <span :class="item.settings === 'manual' ? 'active' : ''" @click="operate(item, index)">手动</span>
            </div>
            <input type="text" v-model.trim="item.value" v-if="show && item.settings === 'manual'">
          </div>
        </div>
      </scroll-list>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/dialog/index.vue';
import ScrollList from '@/components/scrollList/index.vue';
export default {
  data () {
    return {
      type: 'auto',
      inputVal: '',
      show: false
    };
  },
  props: {
    dialogFlag: {
      type: Boolean,
      default: false
    },
    detailInfor: {
      type: Array
    },
    modelName: {
      type: String
    },
    modelId: {
      type: String
    }
  },
  components: {
    Dialog,
    ScrollList
  },
  mounted () {
  },
  methods: {
    loadMore () {},
    operate (item, index) {
      if (item.settings === 'auto') {
        this.$set(this.detailInfor[index], 'settings', 'manual');
      } else {
        this.$set(this.detailInfor[index], 'settings', 'auto');
      }
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    confirmHandler () {
      this.$emit('confirm', this.detailInfor, this.modelId);
    },
    cancelHandler () {
      this.$emit('cancel');
    }
  }
};
</script>
<style lang='scss' scoped>
.tips {
  color: #A4A4A4;
   font-size: 12px;
   line-height: 24px;
   padding: 8px 0px;
}
.table-box {
  width: 100%;
  height: 320px;
  margin-top: 8px;
  .list-box {
    height: 36px;
    width: 100%;
    border-radius: 4px;
    background: #333333;
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    >span, .setting-box {
      display: inline-block;
      padding: 8px;
      width: calc(33.333% - 16px);
      text-align: center;
    }
  }
  .list {
    background: #444444;
    >span {
      text-align: left;
    }
    .limit {
      font-size: 12px;
      color: #DEDEDE;
    }
    .setting-box {
      display: flex;
      align-items: center;
      justify-content: center;
      > input {
        padding: 0px 8px;
        margin: 0px;
        height: 30px;
        box-sizing: border-box;
        width: 128px;
        margin-left: 18px;
        outline: none;
        border: none;
        font-size: 14px;
        color: #CCCCCC;
        border-radius: 4px;
        background: #333333;
      }
    }
    .setting {
      height: 24px;
      line-height: 24px;
      width: 80px;
      background: #333333;
      border-radius: 4px;
      color: #A4A4A4;
      font-size: 12px;
      >span {
        display: inline-block;
        width: 40px;
        cursor: pointer;
      }
      .active {
        background: #222222;
        color: #F6B421;
        border-radius: 4px;
      }
    }
  }
  .table-body {
    height: calc(100% - 40px);
    @include scrollBar(#a4a4a4, 5px);
  }
}
</style>
