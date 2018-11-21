<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref='searchBox' @query='onQueryChange'></search-box>
    </div>
    <div ref='shortcutWrapper' class="shortcut-wrapper" v-show="!query">
      <scroll ref='shortcut' class="shortcut" :data='shortCut'>
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click='addQuery(item.k)' class="item" v-for='(item,index) in hotKeyList' v-bind:key='index'>
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length>0">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click='clearSearchHistory'>
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-history @select='setQuery' @deleteSearch='deleteSearch' :list='searchHistory'></search-history>
          </div>
        </div>
      </scroll>
    </div>
    <div ref='searchResult' class="search-result" v-show="query">
      <suggest ref='suggest' @select='saveSearch' @listScroll='blurInput' :query='query'></suggest>
    </div>
    <confirm ref='confirmRef' @confirm='confirm' @cancel='cancel'></confirm>
    <router-view></router-view>
  </div>
</template>

<script type='ECMAScript6'>
import searchBox from 'base/search-box/search-box';
import suggest from 'components/suggest/suggest';
import SearchHistory from 'base/search-history/search-history';
import confirm from 'base/confirm/confirm';
import scroll from 'base/scroll/scroll';
import {getHotKey} from 'api/search';
import {ERR_OK} from 'api/config';
import {mapActions} from 'vuex';
import {playlistMixin, searchMixin} from 'common/js/mixin';

export default {
  mixins: [playlistMixin, searchMixin],
  components: {
    'search-box': searchBox,
    'search-history': SearchHistory,
    suggest,
    scroll,
    confirm
  },
  data () {
    return {
      hotKeyList: [],
      query: ''
    };
  },
  created () {
    this._getHotKey();
  },
  computed: {
    shortCut () {
      return this.hotKeyList.concat(this.searchHistory);
    }
  },
  watch: {
    // 解决添加歌曲后不能滑动
    query (newval) {
      if (!newval) {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 200);
      }
    }
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.shortcutWrapper.style.bottom = bottom;
      this.$refs.shortcut.refresh();

      this.$refs.searchResult.style.bottom = bottom;
      this.$refs.suggest.refresh();
    },
    _getHotKey () {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKeyList = res.data.hotkey.slice(0, 10);
        }
      });
    },
    clearSearchHistory () {
      this.$refs.confirmRef.show();
    },
    // 删除所有的历史搜索记录
    confirm () {
      this.deleteAllSearch();
    },
    // 点击搜索历史，再在input里面进行搜索
    setQuery (query) {
      this.$refs.searchBox.setQuery(query);
    },
    cancel () {
    },
    ...mapActions([
      'deleteAllSearch'
    ])
  }
};
</script>

<style lang='stylus'>
@import "../../common/stylus/variable"
.search
  position: fixed;
  top: 88px;
  left: 0;
  bottom: 0;
  width: 100%;
  .search-box-wrapper
    margin: 20px;
  .shortcut-wrapper
    padding: 0 20px;
    position: fixed;
    top: 178px;
    bottom: 0;
    .shortcut
      height: 100%;
      overflow: hidden;
      .hot-key
        .title
          font-size: $font-size-medium-x;
          color: $color-text-l;
          line-height: 30px;
          margin-bottom: 8px;
        .item
          display: inline-block;
          padding: 5px 8px;
          margin: 0 10px 8px 0;
          border-radius: 5px;
          font-size: $font-size-medium;
          background: $color-highlight-background;
          color: $color-text-d;
      .search-history
        margin-top: 10px;
        .title
          display: flex;
          align-items: center;
          color: $color-text-l;
          .text
            flex: 1;
            font-size: $font-size-medium-x;
            color: $color-text-l;
          .clear
            flex: 0 0 30px;
  .search-result
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
</style>
