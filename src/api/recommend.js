import jsonp from 'common/js/jsonp';
import {comParams, options} from './config';
import axios from 'axios';

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
  const data = Object.assign({}, comParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });
  return jsonp(url, data, options);
}

export function getDiscList () {
  const url = '/api/getDiscList';
  const data = Object.assign({}, comParams, {
    picmid: 1,
    g_tk: 1230025741,
    rnd: Math.random(),
    hostUin: 0,
    format: 'json',
    platform: 'yqq', // 需要以json格式返回
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29
  });
  // 当需要的数据是post的时候
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  });
}

export function getDisc (disstid) {
  const url = '/api/getDisc';
  console.log(url);
  const data = Object.assign({}, comParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    g_tk: 1317155226,
    hostUin: 0,
    notice: 0,
    platform: 'yqq',
    format: 'jsonp',
    loginUin: '2550936397',
    needNewCode: 0
  });
  return axios.get(url, {
    params: data
  }).catch(function (thrown) {
    if (axios.isCancel(thrown)) {
      console.log('Request canceled', thrown.message);
    }
  }).then((res) => {
    return Promise.resolve(res.data);
  });
}
