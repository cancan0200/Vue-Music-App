<template>
  <div class='player' v-show="playList.length>0">
    <transition name='normal'
    @enter="enter"
    @after-enter="afterEnter"
    @leave='leave'
    @after-leave='afterLeave'>
      <div class="normal-player" v-show="fullscreen">
        <div class="background">
          <img width='100%' height='100%' :src='currentSong.image'>
        </div>
        <div class="top">
          <div class="back" @click='back'>
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <div class="middle"
        @touchstart.prevent='middleTouchStart'
        @touchmove='middleTouchMove'
        @touchend='middleTouchEnd'>
          <div class="middle-l" ref='middleL'>
            <div class="cd-wrapper" ref='cdWrapper'>
              <div class="cd" :class="cdCls">
                <img class='image' :src='currentSong.image'>
              </div>
            </div>
            <div class="play-lyric-wrapper">
              <p class="text">{{playLyric}}</p>
            </div>
          </div>
          <scroll class="middle-r" ref='lyricList' :data='currentLyric && currentLyric.lines'>
            <div class="lyric-wrapper" ref='lyricWrapper'>
              <div v-if='currentLyric'>
                <p ref='lyricline' class="text"
                :class="{'current': currentLineNum === index}"
                v-for='(line,index) in currentLyric.lines' :key='index'>
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <!-- 分页点 -->
          <div class="dot-wrapper">
            <span class="dot" :class="{ 'active': currentShow === 'cd' }"></span>
            <span class="dot" :class="{ 'active': currentShow === 'lyric' }"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime)}}</span>
            <!-- 进度条组件 -->
            <div class="progress-bar-wrapper">
              <progressBar :percent="percent" @percentChange='percentChange'></progressBar>
            </div>
            <span class="time time-r">{{ format(currentSong.duration) }}</span>
          </div>
          <div class="opreators">
            <div class="icon icon-left" @click='changeMode'>
              <i :class="iconmode" ></i>
            </div>
            <div class="icon icon-left" :class="disableCls">
              <i class="icon icon-prev" @click='prev'></i>
            </div>
            <div class="icon icon-center" :class="disableCls" @click='togglePlaying'>
              <i class="icon" :class="playIcon"></i>
            </div>
            <div class="icon icon-right" :class="disableCls">
              <i class="icon icon-next" @click='next'></i>
            </div>
            <div class="icon icon-right" @click.stop='toggleFavoite(currentSong)'>
              <i class="icon" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullscreen" @click='open'>
        <div class="icon">
          <img :class="cdCls" width='40' height='40' :src='currentSong.image'>
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control" @click.stop="togglePlaying">
          <progressCircle :percent='percent' :radius='radius'>
            <i :class="playMiniIcon" class="icon-mini"></i>
          </progressCircle>
        </div>
        <div class="control" @click.stop='showPlaylist'>
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref='playlist'></playlist>
    <audio ref='audio' :src="currentSong.url" @play='canplay' @error='error'
    @timeupdate='updateTime' @ended='end'></audio>
  </div>
</template>

<script type='ECMAScript6'>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import {prefixStyle} from 'common/js/dom';
import {playMode} from 'common/js/config';
import {playerMixin} from 'common/js/mixin';
import animations from 'create-keyframe-animation';
import Lyric from 'lyric-parser';
import progressBar from 'base/progress-bar/progress-bar';
import progressCircle from 'base/progress-circle/progress-circle';
import scroll from 'base/scroll/scroll';
import playlist from 'components/playlist/playlist';

const transform = prefixStyle('transform');
const transitionDuration = prefixStyle('transition-duration');

export default{
  mixins: [playerMixin],
  data () {
    return {
      songReady: false,
      currentTime: 0,
      radius: 22,
      // 当前歌曲的歌词
      currentLyric: null,
      // 当前歌曲的播放行数
      currentLineNum: 0,
      // 控制歌词下方的小圆点的显示
      currentShow: 'cd',
      // 当前正在播放的歌词
      playLyric: ''
    };
  },
  computed: {
    cdCls () {
      return this.playing ? 'play' : 'play pause';
    },
    disableCls () {
      return this.songReady ? '' : 'disabled';
    },
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play';
    },
    playMiniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
    },
    percent () {
      return this.currentTime / this.currentSong.duration;
    },
    ...mapGetters([
      'fullscreen',
      'playing',
      'currentIndex'
    ])
  },
  created () {
    // 用来关联歌词和图片的切换
    this.touch = {};
  },
  methods: {
    showPlaylist () {
      this.$refs.playlist.show();
    },
    // 切换歌的暂停与播放
    togglePlaying () {
      console.log('dd');
      this.setPlayingState(!this.playing);
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    // 切换下一首歌
    next () {
      if (!this.songReady) {
        return;
      }
      if (this.playList.length === 0) {
        this.loop();
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playList.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
        this.songReady = false;
      }
    },
    // 切换上一首歌
    prev () {
      if (!this.songReady) {
        return;
      }
      if (this.playList.length === 0) {
        this.loop();
      } else {
        let index = this.currentIndex - 1;
        if (index === -1) {
          index = this.playList.length - 1;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
        this.songReady = false;
      }
    },
    loop () {
      // 单曲播放
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      // 循环播放时，让歌词偏移到最开始
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    // 保证在快速点击的时候，歌曲加载完毕才可以点击
    canplay () {
      this.songReady = true;
      this.savePlayHistory(this.currentSong);
    },
    // 当切换歌曲的时候，遇到网络错误时或者歌曲加载失败，执行该函数
    error () {
      this.songReady = true;
    },
    updateTime (el) {
      this.currentTime = el.target.currentTime;
    },
    format (interval) {
      interval = interval | 0;
      const minute = interval / 60 | 0;
      const seconds = this._pad(interval % 60);
      return `${minute}:${seconds}`;
    },
    _pad (num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = '0' + num;
        len++;
      }
      return num;
    },
    // 获取歌曲的歌词
    getLyric () {
      this.currentSong.getLyric().then((lyric) => {
        if (this.currentSong.lyric !== lyric) {
          return;
        }
        this.currentLyric = new Lyric(lyric, this.handleLyric);
        if (this.playing) {
          this.currentLyric.play();
        }
      }).catch(() => {
        // 获取不到歌词的时候
        this.currentLyric = null;
        this.playLyric = '';
        this.currentLineNum = 0;
      });
    },
    // 设置歌词的播放滚动
    handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum;
      // 歌词播放到5行之后进行滚动
      if (lineNum > 5) {
        let lineEL = this.$refs.lyricline[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEL, 1000);
      } else {
        this.$refs.lyricList.scrollToElement(0, 1000);
      }
      this.playLyric = txt;
    },
    percentChange (percent) {
      console.log(percent);
      this.$refs.audio.currentTime = percent * this.currentSong.duration;
      if (!this.playing) {
        this.togglePlaying();
      }
      console.log(this.currentLyric);
      if (this.currentLyric) {
        console.log(percent * this.currentTime.duration);
        this.currentLyric.seek(percent * this.currentTime.duration * 1000);
      }
    },
    back () {
      this.setFullscreen(false);
    },
    open () {
      this.setFullscreen(true);
    },
    enter (el, done) {
      const {x, y, scale} = this._getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear',
          delay: 100
        }
      });
      // run
      animations.runAnimation(this.$refs.cdWrapper, 'move', done);
    },
    afterEnter () {
      animations.unregisterAnimation('move');
      this.$refs.cdWrapper.style.animation = '';
    },
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s ease';
      const {x, y, scale} = this._getPosAndScale();
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener('transitionend', done);
    },
    afterLeave () {
      this.$refs.cdWrapper.style[transform] = '';
      this.$refs.cdWrapper.style.transition = '';
    },
    _getPosAndScale () {
      const width = window.innerWidth * 0.8;
      const paddingTop = 80;
      const paddingBottom = 30;
      const paddingLeft = 30;
      const targetWidth = 40;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {x, y, scale};
    },
    // 歌词和图片的层切换
    middleTouchStart (e) {
      this.touch.inited = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.startY = e.touches[0].pageY;
    },
    middleTouchMove (e) {
      if (!this.touch.inited) {
        return;
      }
      const touch = e.touches[0];
      const daltaX = Number.parseFloat(touch.pageX - this.touch.startX);
      const daltaY = Number.parseFloat(touch.pageY - this.touch.startY);
      if (Math.abs(daltaX) < Math.abs(daltaY)) {
        // 代表在纵向滚动，而不是横向滚动
        return;
      }
      const left = Number.parseFloat(this.currentShow === 'cd' ? '0' : -window.innerWidth);
      const offsetWidth = Math.min(0, Math.max(left + daltaX, -window.innerWidth));
      // 滑动的比例
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);

      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = 0;
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      this.$refs.lyricWrapper.style[transitionDuration] = 0;
    },
    middleTouchEnd (e) {
      let offsetWidth;
      let opacity;
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          // 当滑动大于10%则让歌词滑动到最左边,并显示歌词
          offsetWidth = -window.innerWidth;
          this.currentShow = 'lyric';
          opacity = 0;
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        // 从左向右滑
        if (this.touch.percent > 0.1) {
          this.currentShow = 'cd';
          offsetWidth = 0;
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      const time = 300;
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
      this.$refs.middleL.style.opacity = opacity;
      // this.$refs.lyricWrapper.style.opacity = opacity;
      this.$refs.lyricWrapper.style[transitionDuration] = `${time}ms`;
    },
    ...mapMutations({
      setFullscreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENTINDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'savePlayHistory'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!newSong.id) {
        return;
      }
      if (newSong.id === oldSong.id) {
        return;
      }
      // 切歌时停止歌词的播放
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$refs.audio.play();
        this.getLyric();
      }, 1000);
    },
    playing (newPlaying) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
    }
  },
  components: {
    progressBar,
    progressCircle,
    scroll,
    playlist
  }
};
</script>

<style lang='stylus'>
@import '../../common/stylus/variable'
@import '../../common/stylus/mixin'
.player
  .normal-player
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 421;
    background: $color-background;
    .background
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    .top
      position: relative;
      margin-bottom: 30px;
      .back
        position: absolute;
        top: 0;
        left: 6px;
        .icon-back
          color: $color-theme;
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          transform: rotate(-90deg);
      .title
        line-height: 40px;
        text-align: center;
        color: $color-text-d-l;
        font-size: $font-size-large;
      .subtitle
        line-height: 20px;
        width: 100%;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text-d-l;
    .middle
      position: absolute;
      width: 100%;
      top: 80px;
      bottom: 170px;
      font-size: 0;
      white-space: nowrap;
      .middle-l
        display: inline-block;
        vertical-align: top;
        margin: 0 auto;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper
          width: 80%;
          margin: 0 auto;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          .cd
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 10px solid rgba(255, 255, 255, 0.1);
            &.play
              animation: rotate 20s linear infinite;
            &.pause
              animation-play-state: paused;
            .image
              border-radius: 50%;
              width: 100%;
              height: 100%;
        .play-lyric-wrapper
          margin-top: 20px;
          height: 30px;
          text-align: center;
          .text
            line-height: 30px;
            font-size:  $font-size-medium;
            color: $color-text-l;
      .middle-r
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current
              color: $color-text;
    .bottom
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper
        text-align: center;
        font-size: 0;
        .dot
          display: inline-block;
          vertical-align: center;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
      .progress-wrapper
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        .time
          flex: 0 0 30px;
          width: 30px;
          padding: 0 2px;
          line-height: 30px;
          color: $color-text;
          font-size: $font-size-small;
          &.time-l
            text-align: left;
          &.time-r
            text-align: right;
        .progress-bar-wrapper
          flex: 1;
      .opreators
        display: flex;
        align-items: center;
        justify-content: center;
        .icon
          flex: 1;
          color: $color-theme;
          font-size: 20px;
          &.icon-left
            text-align: right;
          &.icon-center
            padding: 0 9px;
            text-align: center;
            .icon
              font-size: 26px;
          &.icon-right
            text-align: left;
            .icon-favorite
              color: $color-sub-theme;
    &.normal-enter-active,&.normal-leave-active
      transition: all 0.4s;
      .top,.bottom
        transition: all 0.4s ease;
    &.normal-enter,&.normal-leave-to
      opacity: 0;
      .top
        transform: translate3d(0,-100px,0);
      .bottom
        transform: translate3d(0,100px,0);
  .mini-player
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    z-index: 410;
    background: $color-highlight-background;
    .icon
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px;
      height: 40px;
      img
        border-radius: 50%;
        &.play
          animation: rotate 20s linear infinite;
        &.pause
          animation-play-state: paused;
    .text
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      height: 40px;
      .name
        color: $color-text;
        font-size: $font-size-medium;
        margin-bottom: 2px;
        line-height: 20px;
      .desc
        line-height: 20px;
        color: $color-text-d;
        font-size: $font-size-small;
    .control
      flex: 0 0 30px;
      width: 30px;
      padding: 0 5px;
      color: $color-theme;
      font-size: 22px;
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        color: $color-theme-d;
      .icon-mini
        position: absolute;
        top: 0;
        left: 0;
  &.mini-enter-active,&.mini-leave-active
    transition: all 0.4s;
  &.mini-enter,&.mini-leave-to
    opacity: 0;
@keyframes rotate {
  0% {
      transform: rotate(0);
  }
  100% {
      transform: rotate(360deg);
  }
}
</style>
