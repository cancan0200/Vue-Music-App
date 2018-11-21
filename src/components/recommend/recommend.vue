<template>
  <div class="recommend" ref='recommend'>
    <scroll class="recommend-content" :data='discList' ref="list">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img class="needsclick" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item" @click='selectItem(item)' :key="item.id">
              <div class="icon">
                <img width='60' height='60' v-lazy='item.imgurl'>
              </div>
              <div class="text">
                <h2 class="title" v-html='item.creator.name'>{</h2>
                <p class="desc" v-html='item.dissname'></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type='text/ECMAScript6'>
import {getRecommend, getDiscList} from 'api/recommend';
import {ERR_OK} from 'api/config';
import {mapMutations} from 'vuex';
import {playlistMixin} from 'common/js/mixin';
import slider from 'base/slider/slider';
import scroll from 'base/scroll/scroll';
export default {
  mixins: [playlistMixin],
  data () {
    return {
      recommends: [],
      discList: []
    };
  },
  created () {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    handlePlaylist (playList) {
      const bottom = playList.length > 0 ? '60px' : '';
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      });
    },
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
        }
      });
    },
    // 选择热门歌单item
    selectItem (item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      });
      this.setDisc(item);
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    slider,
    scroll
  }
};
</script>

<style lang='stylus'>
@import "../../common/stylus/variable"
.recommend
  position: fixed;
  top: 88px;
  left: 0;
  bottom: 0;
  width: 100%;
  .recommend-content
    height: 100%;
    overflow: hidden;
    .recommend-list
      .list-title
        margin: 10px 0;
        color: $color-theme;
        text-align: center;
        font-weight: 500;
        line-height: 2em;
        font-size: $font-size-medium-x;
      .item
        display: flex;
        align-items: center;
        justify-content: middle;
        width: 100%;
        padding: 0 20px 20px 20px;
        box-sizing: border-box;
        .icon
          flex: 0 0 60px;
          width: 60px;
          margin-right: 20px;
          img
            border-radius: 5px;
        .text
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          flex: 1;
          line-height: 20px;
          font-size: $font-size-medium;
          .title
            color: $color-text;
            margin-bottom: 10px;
          .desc
            color: $color-text-l;
</style>
