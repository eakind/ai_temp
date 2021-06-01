<template>
  <div class="project-name">
    <div class="title">项目名称</div>
      <div class="input">
        <input v-model="projectName" type="text" placeholder="请输入项目名称">
      </div>
      <div class="tips">项目名称最多15个中文字符或30个英文字符</div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
export default {
  data () {
    return {
      projectName: ''
    };
  },
  watch: {
    projectName (val) {
      this.setProjectName(this.projectName);
    }
  },
  mounted () {
    this.setProjectName('');
  },
  methods: {
    ...mapMutations(['setProjectName'])
  }
};
</script>
<style lang='scss' scoped>
.project-name {
  .title {
      font-size: 14px;
      display: inline-block;
      line-height: 40px;
      border-bottom: 1px solid #F6B421;
    }
    .input {
      margin: 16px 0px;
      width: 320px;
      height: 36px;
      border-radius: 4px;
      background: #333333;
      >input {
        display: inline-block;
        height: 36px;
        width: 300px;
        padding: 0px 10px;
        border: none;
        outline:none;
        border-radius: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background: none;
        font-size: 14px;
        color: #fff;
      }
      &:focus {
        border: none;
        border-radius: 4px;
        border: none;
        padding: 0px 10px;
        outline:none;
      }
    }
    .tips {
      color: #A4A4A4;
    }
}
</style>
