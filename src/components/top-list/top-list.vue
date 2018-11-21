<template>
  <transition name='slider'>
    <music-list :songs='songList' :title='title' :bgImage='bgImage' :rank='rank'></music-list>
  </transition>
</template>

<script type='ECMAScript6'>
// import {ERR_OK} from 'api/config';
import {mapGetters} from 'vuex';
import {getRankDetail} from 'api/rank';
import {ERR_OK} from 'api/config';
import {CreateSong} from 'common/js/song';
import MusicList from 'components/music-list/music-list';

export default {
  computed: {
    title () {
      return this.topList.topTitle;
    },
    bgImage () {
      // 图片太丑，更换为第一首歌的图片
      if (this.songList.length > 0) {
        return this.songList[0].image;
      }
    },
    ...mapGetters([
      'topList'
    ])
  },
  created () {
    this._getRankDetail();
  },
  data () {
    return {
      songList: [],
      rank: true
    };
  },
  methods: {
    _getRankDetail () {
      if (!this.topList.id) {
        this.$router.push('/rank');
        return;
      }
      getRankDetail(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songList = this._normalizeSongs(res.songlist);
        }
      });
    },
    _normalizeSongs (list) {
      let songs = [];
      list.forEach(function (item) {
        const musicData = item.data;
        if (musicData.songid && musicData.albumid) {
          songs.push(CreateSong(musicData));
        }
      }, this);
      return songs;
    }
  },
  components: {
    'music-list': MusicList
  }
};
</script>

<style lang='stylus'>
.slider-enter-active, .slider-leave-active
  transition: all 0.5s;
.slider-enter, .slider-leave-to
  transform: translate3d(100%, 0, 0);
</style>
