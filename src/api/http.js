import Vue from 'vue';
import axios from 'axios';
import { apiAddr } from './config';
import { getCurRouter } from '@/utils/index.js';
// import errorCodeObj from '@/i18n/backend_cn.js';
// import VueI18n from 'vue-i18n';
// import cn from '../i18n/cn';
// import en from '../i18n/en';
// import hk from '../i18n/cn_hk';
// Vue.use(VueI18n);

// const i18n = new VueI18n({
//   locale: localStorage.getItem('localLang') ? localStorage.getItem('localLang') : 'zh',
//   messages: {
//     zh: cn,
//     en: en,
//     hk: hk
//   }
// });

axios.defaults.baseURL = apiAddr;
axios.defaults.headers = {
  'Content-Type': 'application/json;'
};

axios.interceptors.request.use(
  config => {
    let curRouter = getCurRouter(window.location.hash);
    let locationParam = window.location.href.slice(window.location.href.indexOf('?'));
    if (!locationParam.match(/Authorization/)) {
      for (let key in config.params) {
        if (config.params[key] === null || config.params[key] === undefined || config.params[key] === '') {
          if (key !== 'model_type') {
            delete config.params[key];
          }
        }
      }
    }
    if (config.method === 'get') {
      config.params.dc_current_time = Date.now();
    }
    // modify lss 20200619 jwt验证
    let dcUserToken = localStorage.getItem('dcAIUserToken');
    if (dcUserToken) {
      config.headers.Authorization = dcUserToken;
    }
    if (curRouter) {
      config.headers['frontend-route'] = curRouter;
    }
    let cookieArr = document.cookie.match(new RegExp('(^| )' + '_xsrf' + '=([^;]*)(;|$)'));
    if (cookieArr) {
      config.headers['X-csrftoken'] = decodeURI(cookieArr[2]);
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (typeof (response.data) === 'object') {
        if (response.data.code === 0 || response.data.code === 302) {
          return response.data;
        } else {
          if (response.data.code) {
            Vue.prototype.$message({
              // message: errorCodeObj[response.data.code],
              message: response.data.msg,
              type: 'error',
              duration: 2000
            });
            if (response.data.code === 10201) {
              setTimeout(() => {
                const url = localStorage.getItem('isLoginUrl') || '/dist-dcee/#/';
                localStorage.removeItem('isLoginUrl');
                window.location.href = url;
              }, 3000);
            }
          }
          return response.data;
        };
      } else {
        return response.data;
      }
    }
  },
  error => {
    if (error.response) {
      const url = localStorage.getItem('isLoginUrl') || '/dist-dcee/#/';
      switch (error.response.status) {
        case 401:
          window.location.href = error.response.headers.location;
          break;
        case 403:
          sessionStorage.clear();
          localStorage.removeItem('isLoginUrl');
          window.location.href = url;
          break;
      }
    } else {
    }
    return Promise.reject(error);
  });
Vue.prototype.$axios = axios;
