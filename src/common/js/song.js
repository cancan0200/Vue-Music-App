import {getLyric} from 'api/song';
import {ERR_OK} from 'api/config';
import {Base64} from 'js-base64';

export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id;
    this.mid = mid;
    this.name = name;
    this.singer = singer;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }
  // 获取歌词
  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric);
    }
    return new Promise((resolve, reject) => {
      getLyric(this.id).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric);
          resolve(this.lyric);
        } else {
          reject(new Error('no lyric'));
        }
      });
    });
  }
}

// 工厂方法，简化代码
export function CreateSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.albummid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url: `http://isure.stream.qqmusic.qq.com/C400${musicData.albummid}?guid=6156372135?vkey=91A134958047EC04A21B8BFB7E9107BACB69E05A534FE40D340F735D128ADD558310154230F4BC6CE6710F441F0CB82636782DE73A72ABD4&fromtag=66`
    url: `http://isure.stream.qqmusic.qq.com/C400001Qu4I30eVFYb.m4a?guid=6156372135&vkey=494B20B4DEDCDF912770BC03DA1706A2E701A8E28D06B92B8043DE2ACC85B00AA998F81187CDC686141178962E3213C6F60CC53878DA60A9&uin=0&fromtag=66`
  });
}

export function filterSinger (singer) {
  let ret = [];
  if (!singer) {
    return '';
  }
  singer.forEach(function (item) {
    ret.push(item.name);
  }, this);
  return ret.join('/');
}
