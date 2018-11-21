<template>
  <transition name='addSong'>
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到播放列表</h1>
        <div class="close" @click='hide'>
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-wrapper-box">
        <search-box ref='searchBox' @query='onQueryChange' placeholder='搜索歌曲'></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches @switch='changeSwitch' :currentIndex='currentIndex' :switches='switches'></switches>
        <div class="list-wrapper">
          <scroll ref='refSongList' class="list-scroll" :data='playHistory' v-if='currentIndex === 0'>
            <div class="list-inner">
              <song-list :songs='playHistory' @select='selectPlaySong'></song-list>
            </div>
          </scroll>
          <scroll ref='refSearchHistory' class="list-scroll" :data='searchHistory' v-if='currentIndex === 1'>
            <div class="list-inner">
              <search-history @deleteSearch='deleteSearch' @select='addQuery' :list='searchHistory' ></search-history>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest @listScroll='blurInput' @select='addSongToPlaylist' :query='query' :showSinger='showSinger'></suggest>
      </div>
      <top-tip ref='refTopTip' class="top-tip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type='ECMAScript6'>
import searchBox from 'base/search-box/search-box';
import suggest from 'components/suggest/suggest';
import switches from 'base/switches/switches';
import scroll from 'base/scroll/scroll';
import songList from 'base/song-list/song-list';
import searchHistory from 'base/search-history/search-history';
import topTip from 'base/top-tip/top-tip';
import Song from 'common/js/song';
import {searchMixin} from 'common/js/mixin';
import {mapGetters, mapActions} from 'vuex';

export default {
  mixins: [searchMixin],
  data () {
    return {
      showFlag: false,
      showSinger: false,
      query: '',
      switches: [
        {name: '最近播放'},
        {name: '搜索历史'}
      ],
      currentIndex: 0
    };
  },
  components: {
    'search-box': searchBox,
    'song-list': songList,
    'search-history': searchHistory,
    'top-tip': topTip,
    suggest,
    switches,
    scroll
  },
  computed: {
    ...mapGetters([
      'playHistory',
      'searchHistory'
    ])
  },
  methods: {
    show () {
      this.showFlag = true;
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.refSongList.refresh();
        } else {
          this.$refs.refSearchHistory.refresh();
        }
      }, 20);
    },
    hide () {
      this.showFlag = false;
    },
    addSongToPlaylist () {
      this.saveSearch();
      this.showTip();
    },
    changeSwitch (index) {
      this.currentIndex = index;
    },
    // 选择最近播放列表中的一首歌
    selectPlaySong (song, index) {
      if (index !== 0) {
        this.InsertSong(new Song(song));
        this.showTip();
      }
    },
    // 显示顶部提示框
    showTip () {
      this.$refs.refTopTip.show();
    },
    ...mapActions([
      'InsertSong'
    ])
  }
};
</script>

<style lang='stylus'>
@import "../../common/stylus/variable"
.add-song
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 300;
  background: $color-background;
  &.addSong-enter-active,&.addSong-leave-active
    transition: all 0.3s;
  &.addSong-enter,&.addSong-leave-to
    transform: translate3d(-100%, 0, 0);
  .header
    width: 100%;
    display: flex;
    align-items: center;
    margin: 10px 0;
    box-sizing: border-box;
    padding: 0 20px;
    .title
      flex: 1;
      text-align: center;
      color: $color-text-ll;
    .close
      color: $color-theme;
  .search-wrapper-box
    margin: 0 20px;
  .shortcut
    margin-top: 20px;
    .list-wrapper
      position: absolute;
      top: 140px;
      bottom: 0;
      width: 100%;
      overflow: hidden;
      .list-scroll
        height: 100%;
        overflow: hidden;
        .list-inner
          padding: 10px 20px;
          box-sizing: border-box;
          width: 100%;
  .search-result
    position: fixed;
    top: 110px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
  .top-tip
    padding: 18px 0;
    text-align: center;
    .icon-ok
      font-size: $font-size-medium;
      color: $color-theme;
      margin-right: 5px;
    .tip-title
      font-size: $font-size-medium;
      color: $color-text;
</style>
