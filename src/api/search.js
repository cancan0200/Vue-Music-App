import jsonp from 'common/js/jsonp';
import axios from 'axios';
import {comParams, options} from './config';

export function getHotKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
  const data = Object.assign({}, comParams, {
    platform: 'h5',
    needNewCode: 1
  });
  return jsonp(url, data, options);
}

export function search (query, page, zhida, perpage) {
  const url = '/api/search';
  const data = Object.assign({}, comParams, {
    platform: 'h5',
    needNewCode: 1,
    p: page,
    w: query,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: perpage,
    n: perpage,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    format: 'json'
  });
  return axios.get(url, {
    params: data
  }).then((res) => {
    // Promise.resolve
    return Promise.resolve(res.data);
  });
}
