<template>
  <div class="rank" ref='rank'>
    <scroll class="toplist" :data='topList' ref='toplist'>
      <ul>
        <li class="item" @click='selectItem(item)' v-for='(item,index) in topList' v-bind:key='index'>
          <div class="icon">
            <img width='100' height='100' v-lazy='item.picUrl'>
          </div>
          <ul class="songList">
            <li class="song" v-for="(song, index) in item.songList" v-bind:key='index'>
              <span>{{index + 1}}</span>
              <span>{{song.songname}} - {{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type='ECMAScript6'>
import {getTopList} from 'api/rank';
import {ERR_OK} from 'api/config';
import {playlistMixin} from 'common/js/mixin';
import {mapMutations} from 'vuex';
import scroll from 'base/scroll/scroll';
import loading from 'base/loading/loading';
export default {
  mixins: [playlistMixin],
  data () {
    return {
      topList: []
    };
  },
  components: {
    scroll,
    loading
  },
  created () {
    this._getTopList();
  },
  methods: {
    ...mapMutations({
      setTopList: 'SET_TOPLIST'
    }),
    _getTopList () {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList;
        }
      });
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.rank.style.bottom = bottom;
      this.$refs.toplist.refresh();
    },
    selectItem (item) {
      // 跳转路由
      this.$router.push({
        path: `/rank/${item.id}`
      });
      this.setTopList(item);
    }
  }
};
</script>

<style lang='stylus'>
@import "../../common/stylus/variable"
.rank
  position: fixed;
  top: 86px;
  bottom: 0;
  width: 100%;
  .toplist
    height: 100%;
    overflow: hidden;
    .item
      margin: 0 20px;
      display: flex;
      height: 100px;
      padding-top: 20px;
      &:last-child
        padding-bottom: 20px;
      .icon
        flex: 0 100px;
        width: 100px;
        height: 100px;
      .songList
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 10px 0 20px;
        height: 100px;
        overflow: hidden;
        color: $color-text-d;
        font-size: $font-size-medium;
        background-color: $color-highlight-background;
        .song
          width: 100%;
          display: block;
          overflow: hidden;
          // text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 26px;
    .loading-container
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
</style>
