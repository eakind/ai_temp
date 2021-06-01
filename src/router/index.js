import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

let routes = [{
  path: '/',
  name: 'home',
  component: () => import(/* webpackChunkName: "home" */ '@/views/home.vue'),
  redirect: '/list', // 项目列表
  children: [{
    path: '/list',
    name: 'list',
    component: () => import(/* webpackChunkName: "list" */ '@/views/projectList.vue')
  }, {
    path: '/create',
    name: 'create',
    component: () => import(/* webpackChunkName: "create" */ '@/views/create.vue')
  }, {
    path: '/content',
    name: 'content',
    component: () => import(/* webpackChunkName: "content" */ '@/views/content.vue'),
    redirect: '/conent',
    children: [{
      path: '/content',
      name: 'contentView',
      component: () => import(/* webpackChunkName: "contentview" */ '@/views/content/contentView.vue')
    }, {
      path: '/content/previewdata',
      name: 'previewdata',
      component: () => import(/* webpackChunkName: "previewdata" */ '@/views/content/previewdata.vue')
    }, {
      path: '/content/building',
      name: 'building',
      component: () => import(/* webpackChunkName: "building" */ '@/views/content/building.vue')
    }, {
      path: '/content/result',
      name: 'result',
      component: () => import(/* webpackChunkName: "result" */ '@/views/content/result.vue')
    }]
  }, {
    path: '/modeling',
    name: 'modeling',
    component: () => import(/* webpackChunkName: "modeling" */ '@/views/modeling.vue')
  }]
}];

export default new Router({
  routes: routes
});
