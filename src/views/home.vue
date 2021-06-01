<template>
  <div class="home">
    <home-header class="home-header" />
    <router-view class="home-body"/>
  </div>
</template>
<script>
import HomeHeader from './home/homeHeader.vue';
import { get } from '@/api/server';
import { mapMutations } from 'vuex';
export default {
  data () {
    return {
    };
  },
  components: {
    HomeHeader
  },
  computed: {
  },
  created () {
  },
  mounted () {
    // 主题切换标记
    window.document.documentElement.setAttribute('data-theme', 'default');
    this.getUserInfo();
    this.getProductInfo();
  },
  methods: {
    ...mapMutations(['setUserInfo', 'setProductInfo']),
    getTimeDay (str) {
      if (!str) return 0;
      let time = `${str.slice(0, 4)}/${str.slice(4, 6)}/${str.slice(6, 8)}${str.slice(8, str.length)}`;
      let lastTime = new Date(time).getTime();
      let nowTime = new Date().getTime();
      let day = Math.floor((lastTime - nowTime) / (24 * 60 * 60 * 1000));
      return day;
    },
    async getUserInfo () {
      let params = {};
      let res = await get('userInfo', params);
      if (res.code === 0) {
        let userInfo = {
          userName: res.user_name,
          companyName: res.abbr_name,
          time: 0 || this.getTimeDay(res.expired_time),
          role: res.role_name
        };
        this.setUserInfo(userInfo);
      }
    },
    async getProductInfo () {
      let param = {};
      let res = await get('productInfo', param);
      if (res.code === 0) {
        let productInfo = res;
        this.setProductInfo(productInfo);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.home {
  width: 100%;
  height: 100%;
  position: relative;
  .home-header {
    height: 60px;
  }
  .home-body{
    width: 100%;
    height: calc(100% - 60px);
    overflow: hidden;
  }
}
</style>
