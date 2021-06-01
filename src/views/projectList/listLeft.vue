<template>
  <div class="list-left">
    <div class="left-header">
      <div class="header-info">
        <span class="iconfont icon-db10_useropen"></span>
        <span>{{ userInfo.userName }}</span>
      </div>
      <div class="user-email" @click="isShow=!isShow">
        <span>email@qq.com</span>
        <span class="iconfont icon-db_arrow"></span>
      </div>
      <div class="date-tips">{{ userInfo.time }}天可用</div>
    </div>
    <div class="operate-box" v-if="isShow">
      <div class="operate-list" v-for="(item, index) in operateList" :key="index">
        {{ item.name }}
      </div>
    </div>
    <div class="count-box">
      <div class="count-list" v-for="(item, idx) in countList" :key="idx">
        <div class="list-top">
          <span class="iconfont" :class="item.icon"></span>
          <span v-if="countInfinite(idx) === '0'">{{ setCount(idx) }}</span>
        </div>
        <div class="list-bottom">{{ item.name }}</div>
      </div>
    </div>
    <div class="project-step" v-if="!isShow">
      <div class="step-name">
        <img src="@/assets/logo.png" width="18px" alt="">
        AIBook at a glance
      </div>
      <div class="step-list" v-for="(item, sIdx) in stepList" :key="sIdx">
        <div class="step-title">{{ item.title }}</div>
        <div class="step-content" v-if="item.content">{{ item.content }}</div>
        <div class="step" v-for="(list, lIdx) in item.list" :key="lIdx"> {{ list }}</div>
      </div>
    </div>
    <div class="contact-box">
      <div class="top">
        <span class="iconfont icon-db_email"></span>
        <span>Contact</span>
      </div>
      <span class="bottom">TechSupport@datacube.hk</span>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      stepList: [{
        title: '新建项目',
        content: '新建项目后可在此页面查看项目列表，对项目进行管理。'
      }, {
        title: '项目建模',
        list: ['1. 选择目标特征', '2. 建模前对其他特征进行特征操作（此步骤可跳过）', '3. 选择参与建模的特征', '4. 选择建模方式']
      }, {
        title: '模型结果',
        list: ['1. 选择模型查看结果', '2. 自主选择交叉验证和解锁隔离集', '3. 导出模型结果']
      }],
      operateList: [{
        name: '转到Datacube产品平台'
      }, {
        name: '修改密码'
      }, {
        name: '退出登录'
      }],
      countList: [{
        count: 0,
        icon: 'icon-db__foloder',
        name: '剩余项目'
      }, {
        count: 0,
        icon: 'icon-db_blockProject',
        name: '剩余建模数/月'
      }],
      isShow: true
    };
  },
  computed: {
    ...mapState(['userInfo', 'productInfo'])
  },
  mounted () {
  },
  methods: {
    setCount (index) {
      if (index === 0) {
        return this.productInfo.max_project_count - this.productInfo.project_count;
      } else if (index === 1) {
        return this.productInfo.max_modeling_count - this.productInfo.modeling_count;
      }
    },
    countInfinite (index) {
      if (index === 0) {
        return (this.productInfo.max_project_count === null || this.productInfo.max_project_count === 0) ? '1' : '0';
      } else if (index === 1) {
        return (this.productInfo.max_modeling_count === null || this.productInfo.max_modeling_count === 0) ? '1' : '0';
      }
    }
  }
};
</script>
<style lang="scss">
.list-left {
  width: 192px;
  height: 100%;
  padding: 0px 16px;
  background: #333333;
  font-size: 12px;
  color: #fff;
  padding-top: 24px;
  .left-header {
    .header-info {
      display: flex;
      align-items: center;
      > span:first-child {
        height: 36px;
        width: 36px;
        font-size: 20px;
        border-radius: 50%;
        background: #F6B421;
        position: relative;
        overflow: hidden;
        &::before {
          font-size: 44px;
          position: absolute;
          right: -7px;
          top: -5px;
        }
      }
      > span:nth-child(2) {
        color: #FCF8DF;
        margin-left: 25px;
      }
    }
    .user-email {
      height: 30px;
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .icon-db_arrow {
        display: inline-block;
        transform: rotate(90deg);
        color: #8C8C8C;
        font-size: 12px;
      }
    }
    .date-tips {
      color: #8C8C8C;
      font-size: 10px;
      margin-bottom: 12px;
    }
  }
  .project-step{
    background: #2B2B2B;
    border-radius: 4px;
    font-size: 12px;
    color: #fff;
    padding-bottom: 16px;
    margin-bottom: 8px;
    .step-name {
      display: flex;
      align-items: center;
      padding: 10px 0px 10px 10px;
      font-size: 14px;
      line-height: 18px;
      opacity: 0.9;
      >img {
        margin-right: 10px;
      }
    }
    .step-title {
      opacity: 0.9;
      padding-left: 40px;
      position: relative;
      line-height: 32px;
      &::before {
        content: '';
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #fff;
        position: absolute;
        left: 16px;
        top: 15px;
      }
    }
    .step-content {
      padding: 0px 16px 10px;
      opacity: 0.4;
    }
    .step {
      padding: 0px 16px;
      opacity: 0.4;
    }
  }
  .operate-list {
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    color: #F6B421;
    border-top: 1px solid #444444;
  }
  .count-box {
    border-top: 1px solid #444444;
    display: flex;
    align-items: center;
    padding: 12px 0px;
    .count-list {
      width: 50%;
      .list-top {
        height: 24px;
        line-height: 24px;
        width: 100%;
        font-size: 12px;
        >span:nth-child(2) {
          margin-left: 5px;
        }
      }
      .list-bottom {
        width: 100%;
        font-size: 10px;
      }
    }
  }
  .contact-box {
    border-top: 1px solid #444444;
    padding: 12px 0px 0px 16px;
    .top {
      display: flex;
      align-items: center;
      >span:nth-child(1) {
        color: #F6B421;
      }
      >span:nth-child(2) {
        padding-left: 10px;
        font-size: 14px;
      }
    }
    .bottom {
      color: #8C8C8C;
      padding-top: 10px;
    }
  }
}
</style>
