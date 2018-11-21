// 通过JsonP抓取歌手数据
import jsonp from 'common/js/jsonp';
import {comParams, options} from './config';

export function getSingerList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
  const data = Object.assign({}, comParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    g_tk: 5381,
    platform: 'yqq'
  });
  return jsonp(url, data, options);
}

export function getSingerDetail (SingerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
  const data = Object.assign({}, comParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 30,
    songstatus: 1,
    singermid: SingerId,
    g_tk: 5381
  });
  return jsonp(url, data, options);
}
