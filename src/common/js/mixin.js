import {mapGetters, mapMutations, mapActions} from 'vuex';
import {playMode} from 'common/js/config';
import {shuffle} from 'common/js/util';

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted () {
    this.handlePlaylist(this.playList);
  },
  activated () {
    this.handlePlaylist(this.playList);
  },
  watch: {
    playList (newVal) {
      this.handlePlaylist(newVal);
    }
  },
  methods: {
    handlePlaylist (list) {
      throw new Error('component must impplement handlePLaylist method');
    }
  }
};

// 切换播放模式
export const playerMixin = {
  computed: {
    iconmode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
    },
    ...mapGetters([
      'playList',
      'mode',
      'sequenceList',
      'currentSong',
      'favoritelist'
    ])
  },
  methods: {
    changeMode () {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      // 根据设置实现循环播放、单曲播放、顺序播放，通过设置playlist
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.setPlayList(list);
    },
    resetCurrentIndex (list) {
      let index = this.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    toggleFavoite (song) {
      if (this._isFavorite(song)) {
        this.deleteFavoriteList(song);
      } else {
        this.saveFavoriteList(song);
      }
    },
    getFavoriteIcon (song) {
      if (this._isFavorite(song)) {
        return 'icon-favorite';
      } else {
        return 'icon-not-favorite';
      }
    },
    _isFavorite (song) {
      let index = this.favoritelist.findIndex((item) => {
        return item.id === song.id;
      });
      return index > -1;
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENTINDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
};

export const searchMixin = {
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    data () {
      return {
        query: ''
      };
    },
    blurInput () {
      // 列表滚动时，会有键盘挡着，让input失去焦点
      this.$refs.searchBox.blur();
    },
    // 保存搜索结果 保存在本地中
    saveSearch () {
      this.SaveSearchHistory(this.query);
    },
    onQueryChange (query) {
      this.query = query;
    },
    addQuery (key) {
      this.$refs.searchBox.setQuery(key);
    },
    // 删除一条搜索历史
    deleteSearch (item) {
      this.deleteOneSearch(item);
    },
    ...mapActions([
      'SaveSearchHistory',
      'deleteOneSearch'
    ])
  }
};
