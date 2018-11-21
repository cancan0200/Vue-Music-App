import Vue from 'vue';
import VueX from 'vuex';
import * as actions from './action';
import * as getters from './getter';
import state from './state';
import mutations from './mutations';
import createLogger from 'vuex/dist/logger'; // 在控制台打印所做的操作

// vuex的入口文件
Vue.use(VueX);
// 用作线下环境进行调试
const debug = process.env.NODE_DNV !== 'production';

export default new VueX.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
