import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueLazyLoad from 'vue-lazyload';
import store from './store';
import router from './projectConfig/routes';

import '@/common/stylus/index.styl';

Vue.use(VueRouter);
Vue.config.productionTip = false;

/* eslint-disable no-new */
Vue.use(VueLazyLoad, {
  loading: require('common/images/default.png')
});

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
