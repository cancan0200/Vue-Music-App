<template>
  <transition name='playlist'>
    <div class="playlist" v-show="showFlag" @click='hide'>
      <div class="playlist-wrapper" @click.stop>
        <div class="list-header">
            <h1 class="title">
                <span class="icon-mode" @click='changeMode'>
                    <i :class="iconmode"></i>
                </span>
                <span class="text">{{modeText}}</span>
                <span class="icon-clear-box" @click='clearPlayList'>
                    <i class="icon-clear"></i>
                </span>
            </h1>
        </div>
        <scroll :data='sequenceList' ref='listContent' class="list-content" v-if="playList.length">
          <transition-group name='list' tag='ul'>
            <li ref='listitem' @click='selectItem(item,index)' class="item" v-for='(item,index) in sequenceList' v-bind:key='index'>
                <i class="current" :class="getCurrentIcon(item)"></i>
                <span class="text">{{item.name}}</span>
                <span class="like" @click.stop='toggleFavoite(item)'>
                  <i :class="getFavoriteIcon(item)"></i>
                </span>
                <span class="delete" @click.stop='deleteOneSong(item)'>
                  <i class="icon-delete"></i>
                </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click='addSong'>
            <i class="icon-add"></i>
            <span class="text">添加歌曲到播放列表</span>
          </div>
        </div>
        <div class="list-close" @click='hide'>
          <span class="text">关闭</span>
        </div>
        <confirm ref='confirm'
        @confirm='confirmClearList'
        @cancel='cancel' text='确认清空列表吗' confirmBtnText='清空'></confirm>
        <add-song ref='addSong'></add-song>
     </div>
    </div>
  </transition>
</template>

<script type='ECMAScript6'>
import {mapActions} from 'vuex';
import {playMode} from 'common/js/config';
import {playerMixin} from 'common/js/mixin';
import scroll from 'base/scroll/scroll';
import confirm from 'base/confirm/confirm';
import addSong from 'components/add-song/add-song';
export default {
  mixins: [playerMixin],
  data () {
    return {
      showFlag: false
    };
  },
  components: {
    scroll,
    confirm,
    'add-song': addSong
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!newSong.id || !oldSong.id) {
        return;
      }
      if (!this.showFlag || newSong.id !== oldSong.id) {
        this.scrollToCurrent(newSong);
      }
    }
  },
  computed: {
    modeText () {
      return this.mode === playMode.random ? '随机播放' : this.mode === this.loop ? '单曲循环' : '顺序播放';
    }
  },
  methods: {
    clearPlayList () {
      this.$refs.confirm.show();
    },
    confirmClearList () {
      this.deleteAllPlaylist();
    },
    cancel () {
    },
    // 添加歌曲到播放列表
    addSong () {
      this.$refs.addSong.show();
    },
    show () {
      this.showFlag = true;
      // 重新计算高度
      setTimeout(() => {
        this.$refs.listContent.refresh();
        this.scrollToCurrent(this.currentSong);
      }, 20);
    },
    hide () {
      this.showFlag = false;
    },
    getCurrentIcon (item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play';
      }
    },
    selectItem (item, index) {
      // 随机播放歌曲
      if (this.mode === playMode.random) {
        index = this.playList.findIndex((song) => {
          return song.id === item.id;
        });
      }
      // 顺序播放歌曲
      this.setCurrentIndex(index);
      this.setPlayingState(true);
    },
    scrollToCurrent (song) {
      // 获取索引
      const index = this.sequenceList.findIndex((item) => {
        return item.id === song.id;
      });
      setTimeout(() => {
        if (index !== 0) {
          this.$refs.listContent.scrollToElement(this.$refs.listitem[index], 200);
        }
      }, 100);
    },
    deleteOneSong (item) {
      this.deleteOneSong(item);
      if (!this.playList) {
        this.hide();
      }
    },
    ...mapActions([
      'deleteOneSong',
      'deleteAllPlaylist'
    ])
  }
};
</script>

<style lang='stylus'>
@import '../../common/stylus/variable'
@import '../../common/stylus/mixin'
.playlist
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 410;
  background: $color-background-d;
  &.playlist-enter-active, &.playlist-leave-active
    transition: all 0.3s;
    .playlist-wrapper
      transition: all 0.3s;
  &.playlist-enter, &.playlist-leave-to
    opacity: 0;
    .playlist-wrapper
      animation: myanimation 0.3s;
  .playlist-wrapper
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    background: $color-highlight-background;
    .list-header
      position: relative;
      padding: 20px 30px 10px 20px;
      .title
        display: flex;
        align-items: center;
        .icon-mode
          extend-click();
          color: $color-theme-d;
        .icon-clear-box
          extend-click();
          color: $color-text-l;
        .text
          flex: 1;
          margin-left: 12px;
          font-size: $font-size-medium;
          color: $color-text-l;
    .list-content
      width: 100%;
      padding: 0 20px;
      margin-top: 10px;
      box-sizing: border-box;
      max-height: 280px;
      overflow: hidden;
      .item
        display: flex;
        align-items: center;
        height: 40px;
        overflow: hidden;
        &.list-enter-active,&.list-leave-&.list-enter-active
          transition: all 0.2s linear;
        &.list-enter,&.list-leave-to
          height: 0;
        .like,.delete,.current
          width: 30px;
          flex: 0 0 30px;
          color: $color-theme-d;
          .icon-favorite
            color: $color-sub-theme;
        .text
          flex: 1;
          color: $color-text-l;
    .list-operate
      text-align: center;
      .add
        display:inline-block
        padding: 8px 20px;
        margin: 20px auto;
        border-radius: 15px;
        border: 1px solid $color-text-l;
        text-align: center;
        color: $color-text-l;
        font-size: $font-size-small;
        .icon-add
          margin-right: 5px;
    .list-close
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: $color-text-l;
      background: $color-background-d;
@keyframes myanimation {
  0%: {
    transform: translate3d(0, 0, 0);
  }
  100%: {
    transform: translate3d(0, 100%, 0);
  }
}
</style>
