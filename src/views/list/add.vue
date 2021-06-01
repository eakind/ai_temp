<template>
  <div class="add-project" @click="newProject">
    <span class="iconfont icon-db_plus"><span class="set-font">{{$t('createProject')}}</span></span>
    <welcome-man v-if="welcomeFlag"></welcome-man>
  </div>
</template>
<script>
import WelcomeMan from './add/welcomeMan.vue';
export default {
  data () {
    return {
      welcomeFlag: false,
      timer: null
    };
  },
  props: {
    list: {
      type: Array,
      defalut: () => {
        return [];
      }
    },
    // 查询的项目状态
    status: {
      type: String
    },
    keyWord: {
      type: String
    }
  },
  watch: {
    list: {
      handler (list) {
        this.welcomeFlag = false;
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          // 当列表没有项目时显示welcome图案，status为项目状态，为空时表示查询全部
          if (!list.length && !this.status && !this.keyWord) {
            this.welcomeFlag = true;
          }
        }, 100);
      },
      deep: true
    }
  },
  components: {
    WelcomeMan
  },
  beforeDestroy () {
    // window.removeEventListener('resize', this.resizeHandler);
  },
  mounted () {
    // this.setPos();
    // window.addEventListener('resize', this.resizeHandler, false);
  },
  methods: {
    newProject () {
      this.$router.push({ path: '/create' });
    }
    // resizeHandler (event) {
    //   this.setPos();
    // },
    // // 动态设置welcome的坐标
    // setPos () {
    //   this.$nextTick(() => {
    //     // let left = this.$el.getBoundingClientRect().left;
    //     // let top = this.$el.getBoundingClientRect().bottom;
    //     // this.$set(this.posObj, 'left', left + 'px');
    //     // this.$set(this.posObj, 'top', top + 'px');
    //   });
    // }
  }
};
</script>
<style lang='scss' scoped>
.add-project{
  display: inline-block;
  height: 250px;
  border-radius: 10px;
  line-height: 280px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  @include bgColor('bColor2');
  position: relative;
  .icon-db_plus{
    font-size: 18px;
    line-height: 0px;
    position: relative;
    &::before{
      top: -25px;
      left: 50%;
      font-size: 26px;
      transform: translateX(-50%);
      @include fColor('mColor1');
      position: absolute;
    }
  }
}
</style>
