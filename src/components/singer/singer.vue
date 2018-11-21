<template>
  <div class="singer" ref='singer'>
    <listview :data='singers' @select='selectSinger' ref='listview'></listview>
    <router-view></router-view>
  </div>
</template>

<script type='ECMAScript6'>
import Singer from 'common/js/singer';
import listview from 'base/listview/listview';
import {mapMutations} from 'vuex'; // 语法糖，避免写很长的代码
import {playlistMixin} from 'common/js/mixin';
import {getSingerList} from 'api/singer';
import {ERR_OK} from 'api/config';

const HOT_SINGER_LEN = 10;
const HOT_NAME = '热门';

export default {
  mixins: [playlistMixin],
  data () {
    return {
      singers: []
    };
  },

  components: {
    listview
  },

  created () {
    this._getSingerList();
    this._normalizeSinger(this.singers);
  },

  methods: {
    selectSinger (singer) {
      this.$router.push({
        path: `/singer/${singer.mid}` // 跳转路由并传入singer的id 这里有问题
      });
      this.setSinger(singer); // 提交mutation
    },

    handlePlaylist (playList) {
      const bottom = playList.length > 0 ? '60px' : '';
      this.$refs.singer.style.bottom = bottom;
      this.$refs.listview.refresh();
    },
    // 获取singers的数据
    _getSingerList () {
      getSingerList().then((res) => {
        if (ERR_OK === res.code) {
          this.singers = this._normalizeSinger(res.data.list);
        }
      });
    },

    // 处理singers数据
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };

      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_id,
            mid: item.Fsinger_mid,
            name: item.Fsinger_name
          }));
        }
        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_id,
          mid: item.Fsinger_mid,
          name: item.Fsinger_name
        }));
      });

      // 为了得到有序列表，这里我们要去处理map
      let hot = [];
      let ret = [];
      for (let key in map) {
        if (map[key].title.match(/[a-zA-Z]/)) {
          // 如果title是A-Z，则添加到该数组
          ret.push(map[key]);
        } else if (map[key].title === HOT_NAME) {
          // 如果title为hot
          hot.push(map[key]);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
};
</script>

<style lang='stylus'>
.singer
  position: absolute;
  top: 88px;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
</style>
