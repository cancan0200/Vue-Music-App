<template>
  <transition name='slider'>
    <!-- <div class="singer-detail">
    </div> -->
    <music-list :songs='songs' :title='title' :bgImage='bgImage'></music-list>
  </transition>
</template>

<script type='ECMAScript6'>
import {getSingerDetail} from 'api/singer';
import {ERR_OK} from 'api/config';
import {mapGetters} from 'vuex';
import {CreateSong} from 'common/js/song';
import MusicList from 'components/music-list/music-list';

export default {
  data () {
    return {
      songs: []
    };
  },
  components: {
    'music-list': MusicList
  },
  computed: {
    title () {
      return this.singer.name;
    },
    bgImage () {
      return this.singer.avatar;
    },
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getSingerDetail();
  },
  methods: {
    _getSingerDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer');
        return;
      }
      getSingerDetail(this.singer.mid).then((res) => {
        if (ERR_OK === res.code) {
          this.songs = this._normalizeSongs(res.data.list);
        }
      });
    },
    _normalizeSongs (list) {
      let ret = [];
      list.forEach(function (item) {
        let {musicData} = item;
        if (musicData.songid && musicData.albummid) {
          ret.push(CreateSong(musicData));
        }
      }, this);
      return ret;
    }
  }
};
</script>

<style lang='stylus'>
.slider-enter-active, .slider-leave-active
  transition: all 0.5s;
.slider-enter, .slider-leave-to
  transform: translate3d(100%, 0, 0);
</style>
