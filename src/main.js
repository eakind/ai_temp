import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';

// 多语言文件
import VueI18n from 'vue-i18n';
import cn from './i18n/cn';
import en from './i18n/en';
import hk from './i18n/cn_hk';

// 公共颜色跟字体图表
import '@/styles/common.scss';

// 指令
import '@/directives/vClickOut/index.js';
import '@/directives/vTooltip/index.js';

// 引入插件
import '@/plugins/plugins.js';

// 引入element-ui
import '@/plugins/element.js';

import { getQueryVariable } from '@/utils/index.js';

const authorization = getQueryVariable('Authorization');
const curRouter = getQueryVariable('route');

if (authorization) {
  localStorage.setItem('dcAIUserToken', authorization);
}
if (curRouter) {
  window.location = '#' + curRouter;
}

// bus总线传值
Vue.prototype.bus = new Vue();

Vue.config.productionTip = false;

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: localStorage.getItem('localLang') ? localStorage.getItem('localLang') : 'zh',
  messages: {
    zh: cn,
    en: en,
    hk: hk
  }
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
