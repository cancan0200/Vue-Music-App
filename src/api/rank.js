import jsonp from 'common/js/jsonp';
import {comParams, options} from './config';

export function getTopList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
  const data = Object.assign({}, comParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });
  return jsonp(url, data, options);
}
export function getRankDetail (topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
  const data = Object.assign({}, comParams, {
    platform: 'h5',
    needNewCode: 1,
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid: topid
  });
  return jsonp(url, data, options);
}
