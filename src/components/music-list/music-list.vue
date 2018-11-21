<template>
  <div class='music-list'>
    <div class="header">
      <div class="back" @click='back'>
        <i class="icon-back"></i>
      </div>
      <h1 class="title">{{title}}</h1>
    </div>
    <div class="bg-img" ref='bgImg' :style='bgStyle'>
      <div class="play-wrapper" ref='playWrapper'>
        <div class="play" @click='random'>
          <i class="icon-play"></i>
          <span class="text">随机播放</span>
        </div>
      </div>
      <div class="filter" ref='filter'></div>
    </div>
    <div class='bg-layer' ref='layer'></div>
    <scroll @scroll="scroll" :data='songs' class="list" ref='list'
    :listen-scroll='listenScroll' :probe-type='probeType'>
      <div class="song-list-wrapper">
        <song-list @select='selectItem' :songs='songs' :rank='rank'></song-list>
      </div>
    </scroll>
    <div class="loading-container" v-show="!songs.length">
      <loading></loading>
    </div>
  </div>
</template>

<script type='ECMAScript6'>
import SongList from 'base/song-list/song-list';
import Scroll from 'base/scroll/scroll';
import loading from 'base/loading/loading';
import {prefixStyle} from 'common/js/dom';
import {mapActions} from 'vuex';
import {playlistMixin} from 'common/js/mixin';

const RESERVE_HEIGHT = 40;
const transform = prefixStyle('transform');
const backdrop = prefixStyle('backdrop-filter');

export default {
  mixins: [playlistMixin],
  components: {
    'song-list': SongList,
    'scroll': Scroll,
    'loading': loading
  },
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scrollY: 0
    };
  },
  mounted () {
    this.imageHeight = this.$refs.bgImg.clientHeight;
    this.minTranslateY = -this.imageHeight + RESERVE_HEIGHT;
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
  },
  computed: {
    bgStyle () {
      return `background-image: url(${this.bgImage})`;
    }
  },
  created () {
    this.probeType = 3;
    this.listenScroll = true;
    // console.log(this.songs);
  },
  watch: {
    scrollY (newY) {
      let transformY = Math.max(this.minTranslateY, newY);
      let zIndex = 0;
      let scale = 1;
      let blur = 0;
      const formu = Math.abs(newY / this.imageHeight);

      // 设置放大缩小的效果
      if (newY > 0) {
        scale = 1 + formu;
        zIndex = 10;
      } else {
        blur = Math.min(20 * formu, 20);
      }
      // 设置不推到顶，留一部分
      if (newY < this.minTranslateY) {
        zIndex = 10;
        this.$refs.bgImg.style.paddingTop = 0;
        this.$refs.bgImg.style.height = `${RESERVE_HEIGHT}px`;
        this.$refs.playWrapper.style.display = 'none'; // 设置播放按钮的显示
      } else {
        this.$refs.bgImg.style.paddingTop = '70%';
        this.$refs.bgImg.style.height = 0;
        this.$refs.playWrapper.style.display = 'block';
      }
      this.$refs.layer.style[transform] = `translate3d(0 ,${transformY}px, 0)`;
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
      this.$refs.bgImg.style.zIndex = zIndex;
      this.$refs.bgImg.style[transform] = `scale(${scale})`;
    }
  },
  methods: {
    handlePlaylist (playList) {
      const bottom = playList.length > 0 ? '60px' : '';
      this.$refs.list.$el.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    scroll (pos) {
      this.scrollY = pos.y;
    },
    back () {
      this.$router.back();
    },
    selectItem (item, index) {
      this.selectPlay({
        'list': this.songs,
        'index': index
      });
    },
    random () {
      // 随机播放歌曲
      this.randomPlay({
        list: this.songs
      });
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  }
};
</script>

<style lang='stylus'>
@import '../../common/stylus/variable'
.music-list
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 190;
  background: $color-background;
  .header
    position: absolute;
    top: 0;
    left: 0;
    z-index: 33;
    height: 30px;
    width: 100%;
    .back
      padding: 9px;
      position: absolute;
      top: 0;
      left: 0;
      color: $color-theme;
      font-size: $font-size-large-x;
    .title
      text-align: center;
      line-height: 40px;
      font-size: $font-size-medium-x;
      color: $color-text;
  .bg-layer
    background: $color-background;
    position: relative;
    height: 100%;
  .bg-img
    padding-top: 70%;
    width: 100%;
    height: 0;
    position: relative;
    transform-origin: top;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    .filter
      position: absolute;
      left: 0;
      top: 0;
      z-index: 3;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    .play
      box-sizing: border-box;
      position: absolute;
      bottom: 10%;
      left: 0;
      right: 0;
      z-index: 99;
      margin: auto;
      width: 135px;
      padding: 7px 0;
      border: 1px solid $color-theme;
      border-radius: 100px;
      color: $color-theme;
      text-align: center;
      font-size: 0;
      .icon-play
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
        font-size: $font-size-medium-x;
      .text
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
  .list
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    // height: 100%;
    background: $color-background;
    .song-list-wrapper
      padding: 10px 20px;
  .loading-container
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
</style>
