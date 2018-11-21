<template>
  <transition name='fade'>
    <div class="user-center">
      <div class="back" @click='back'>
        <i class="icon-back"></i>
      </div>
      <div class="switches">
          <switches @switch='changeSwitch' :switches='switches' :currentIndex='currentIndex'></switches>
      </div>
      <div class="play-btn" @click='random'>
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref='listWrapper'>
         <scroll ref='refFavoriteList' class="list-scroll" :data='favoritelist' v-if='currentIndex === 0'>
            <div class="list-inner">
              <song-list :songs='favoritelist' @select='selectPlaySong'></song-list>
            </div>
          </scroll>
          <scroll ref='refPlayList' class="list-scroll" :data='playHistory' v-if='currentIndex === 1'>
            <div class="list-inner">
              <song-list  @select='selectPlaySong' :songs='playHistory' ></song-list>
            </div>
          </scroll>
      </div>
      <div class="no-result" v-show="resultShow">
        <no-result :title='noresultTitle'></no-result>
      </div>
    </div>
  </transition>
</template>

<script type='ECMAScript6'>
import switches from 'base/switches/switches';
import scroll from 'base/scroll/scroll';
import songList from 'base/song-list/song-list';
import noResult from 'base/no-result/no-result';
import Song from 'common/js/song';
import {mapGetters, mapActions} from 'vuex';
import {playlistMixin} from 'common/js/mixin';

export default {
  mixins: [playlistMixin],
  data () {
    return {
      switches: [
        {name: '我喜欢的'},
        {name: '最近听的'}
      ],
      currentIndex: 0
    };
  },
  components: {
    switches,
    scroll,
    'no-result': noResult,
    'song-list': songList
  },
  computed: {
    resultShow () {
      if (this.currentIndex === 0) {
        return !this.favoritelist.length;
      } else {
        return !this.playHistory.length;
      }
    },
    noresultTitle () {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲';
      } else {
        return '没有播放过歌曲哦';
      }
    },
    ...mapGetters([
      'favoritelist',
      'playHistory'
    ])
  },
  watch: {
    currentIndex (newIndex) {
      setTimeout(() => {
        if (newIndex === 0) {
          this.$refs.refFavoriteList.refresh();
        } else {
          this.$refs.refPlayList.refresh();
        }
      });
    }
  },
  methods: {
    back () {
      this.$router.back();
    },
    changeSwitch (index) {
      this.currentIndex = index;
    },
    selectPlaySong (song, index) {
      if (index !== 0) {
        this.InsertSong(new Song(song));
      }
    },
    handlePlaylist (list) {
      const bottom = list.length > 0 ? '60px' : '';
      this.$refs.listWrapper.style.bottom = bottom;
      if (this.currentIndex === 0) {
        this.$refs.refFavoriteList.refresh();
      } else {
        this.$refs.refPlayList.refresh();
      }
    },
    // 随机播放歌曲
    random () {
      let list = this.currentIndex === 0 ? this.favoritelist : this.playHistory;
      if (list.lengh === 0) {
        return;
      }
      list = list.map((song) => {
        return new Song(song);
      });
      console.log(list);
      this.randomPlay({
        list
      });
    },
    ...mapActions([
      'InsertSong',
      'randomPlay'
    ])
  }
};
</script>

<style lang='stylus'>
@import '../../common/stylus/variable'
.user-center
  position: fixed;
  top: 0;
  bottom 0;
  width: 100%;
  z-index: 400;
  background-color: $color-background;
  &.fade-enter-active,&.fade-leave-active
    transition: all 0.5s;
  &.fade-enter,&.fade-leave-to
    transform: translate3d(-100%, 0, 0);
  .switches
    margin-top: 5px;
  .back
    padding: 9px;
    position: absolute;
    top: 0;
    left: 0;
    color: $color-theme;
    font-size: $font-size-large-x;
  .play-btn
    text-align: center;
    padding: 8px 0;
    width: 135px
    margin: 0 auto;
    margin-top: 30px;
    border: 1px solid $color-theme;
    border-radius:20px;
    font-size: 0;
    color: $color-theme;
    .icon-play
      margin-right: 5px;
      font-size: $font-size-small;
    .text
      font-size: $font-size-small;
  .list-wrapper
    padding: 5px 20px;
    box-sizing: border-box;
    position: fixed;
    top: 115px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .list-scroll
      height: 100%;
      overflow: hidden;
  .no-result
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
</style>
