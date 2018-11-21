import Vue from 'vue';
import VueRouter from 'vue-router';

import Recommend from 'components/recommend/recommend';
import Singer from 'components/singer/singer';
import Search from 'components/search/search';
import Rank from 'components/rank/rank';
import SingerDetail from 'components/singer-detail/singer-detail';
import TopList from 'components/top-list/top-list';
import UserCenter from 'components/user-center/user-center';
import RecommendDetail from 'components/recommend-detail/recommend-detail';

Vue.use(VueRouter);

/* eslint-disable-next-line */
/* eslint-disable */
const router = new VueRouter({
    routes: [
      {
        // 设置根目录
        path: '/',
        redirect: '/recommend'
      },
      {
        path: '/recommend',
        component: Recommend,
        children: [
          {
            path: ':id',
            component: RecommendDetail
          }
        ]
      },
      {
        path: '/singer',
        component: Singer,
        children: [
          {
            path: ':mid', // 通过id来访问子路由
            component: SingerDetail
          }
        ]
      },
      {
        path: '/rank',
        component: Rank,
        children: [
          {
            path: ':id',
            component: TopList
          }
        ]
      },
      {
        path: '/search',
        component: Search,
        children: [
          {
            path: ':mid', // 通过id来访问子路由
            component: SingerDetail
          }
        ]
      },
      {
        path: '/user',
        component: UserCenter
      }
  ]
  });
  
  export default router;
