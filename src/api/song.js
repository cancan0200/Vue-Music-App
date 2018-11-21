import {comParams} from './config';
import axios from 'axios';

export function getLyric (mid) {
  const url = '/api/lyric';
  const data = Object.assign({}, comParams, {
    musicid: mid,
    pcachetime: +new Date(),
    g_tk: 1919511572,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    format: 'json'
  });
  return axios.get(url, {
    params: data
  }).then((res) => {
    // Promise.resolve
    return Promise.resolve(res.data);
  });
}
