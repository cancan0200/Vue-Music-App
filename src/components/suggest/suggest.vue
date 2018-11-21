<template>
  <scroll :data='result' :pullup='pullup' :beforeScroll='beforescroll'
  :pulldown='pulldown'
  @beforeScroll='listScroll'
  @scrollToEnd='searchMore'
  @scrollToTop='dropDownRefresh'
  ref='suggest' class="suggest">
    <ul class="suggest-list">
      <li @click='selectItem(item)' class="suggest-item" v-for='(item, index) in result' v-bind:key='index'>
        <div class="icon">
          <i :class="getIconCls(item.type)"></i>
        </div>
        <div class="name">
          <p class="text" v-html='getDisplayName(item)'></p>
        </div>
      </li>
      <li><loading v-show="hasMore" title=''></loading></li>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result :title='title'></no-result>
    </div>
  </scroll>
</template>

<script type='ECMAScript6'>
import scroll from 'base/scroll/scroll';
import loading from 'base/loading/loading';
import NoResult from 'base/no-result/no-result';
import Singer from 'common/js/singer';
import {search} from 'api/search';
import {ERR_OK} from 'api/config';
import {CreateSong} from 'common/js/song';
import {mapMutations, mapActions} from 'vuex';

const TYPE_SINGER = 'singer';
const PERPAGE = 10;

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      pullup: true,
      pulldown: true,
      beforescroll: true,
      hasMore: true,
      result: []
    };
  },
  computed: {
    title () {
      return `抱歉，没有查询与${this.query}相关的数据`;
    }
  },
  components: {
    scroll,
    loading,
    'no-result': NoResult
  },
  watch: {
    query () {
      this._search();
    }
  },
  methods: {
    // 上拉刷新
    searchMore () {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data));
          this._checkMore(res.data);
        }
      });
    },
    // 扩展下拉刷新
    dropDownRefresh () {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data).concat(this.result);
          this._checkMore(res.data);
        }
      });
    },
    _search () {
      // 请求服务端，抓取搜索的数
      this.page = 1;
      this.$refs.suggest.scrollTo(0, 0); // 将scroll组件滑动到顶部
      this.hasMore = true;
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data);
          this._checkMore(res.data);
        }
      });
    },
    // 判断是否还有请求的数据
    _checkMore (data) {
      const song = data.song;
      if (!song.list.length || (song.curnum + song.curpage) * PERPAGE > song.totalnum) {
        this.hasMore = false;
      }
    },
    _genResult (data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({
          ...data.zhida,
          ...{type: TYPE_SINGER}
        });
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list));
      }
      return ret;
    },
    _normalizeSongs (list) {
      let ret = [];
      list.forEach(function (musicData) {
        if (musicData.songid && musicData.albumid) {
          ret.push(CreateSong(musicData));
        }
      }, this);
      return ret;
    },
    getIconCls (type) {
      if (type === TYPE_SINGER) {
        return 'icon-mine';
      } else {
        return 'icon-music';
      }
    },
    getDisplayName (item) {
      // 获取显示的内容
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        console.log(item.type);
        // 歌手的点击
        const singer = new Singer({
          id: item.singerid,
          mid: item.singermid,
          name: item.singername
        });
        this.$router.push({
          path: `/search/${singer.mid}`
        });
        this.setSinger(singer);
      } else {
        // 歌曲的点击
        this.InsertSong(item);
      }
      this.$emit('select');
    },
    listScroll () {
      // 列表滚动前
      this.$emit('listScroll');
    },
    refresh () {
      this.$refs.suggest.refresh();
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'InsertSong'
    ])
  }
};
</script>

<style lang='stylus'>
@import '../../common/stylus/variable'
@import '../../common/stylus/mixin'
.suggest
  width: 100%;
  height: 100%;
  overflow: hidden;
  .suggest-list
    .suggest-item
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 0 20px;
      height: 50px;
      width: 100%;
      color: $color-text-d;
      .name
        flex: 1;
        no-wrap();
        line-height: 50px;
        color: $color-text-d;
      .icon
        flex: 0 0 30px;
        line-height: 50px;
  .no-result-wrapper
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
</style>
