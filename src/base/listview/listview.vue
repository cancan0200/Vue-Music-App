<template>
  <scroll class="listview" :data="data" ref="listview"
  :listen-scroll='listenScroll' @scroll='scroll'
  :probe-type='probeType'>
      <ul>
          <li v-for='(group,index) in data' class="list-group" ref='listgroup' :key='index'>
              <h2 class="list-group-title">{{group.title}}</h2>
              <ul>
                  <li v-for='item in group.items' class="list-group-item" @click='selectItem(item)'
                  :key='item.id'>
                      <img class="avatar" v-lazy='item.avatar'>
                      <span class="name">{{item.name}}</span>
                  </li>
              </ul>
          </li>
      </ul>
      <div class="loading-container" v-show="!data.length">
        <loading></loading>
      </div>
      <div class="list-shortcut" @touchstart='onShortTouchStart'
       @touchmove.stop.prevent='onShortTouchMove'>
        <ul>
          <li v-for='(item, index) in shortCutList'
          :key="item"
          :data-index='index'
          :class='{current: currentIndex === index}'
          class="item"
          >
            {{item}}
          </li>
        </ul>
      </div>
      <div class="list-fixed" v-show="fixedTitle" ref="fixedTop">
        <h1 class="title">{{fixedTitle}}</h1>
      </div>
  </scroll>
</template>
<script type='ECMAScript6'>
import scroll from 'base/scroll/scroll';
import loading from 'base/loading/loading';
import { getData } from 'common/js/dom.js';
const ANCHORHEIGHT = 18;
const TITLEHEIGHT = 20;

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: 0
    };
  },
  created () {
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    this.probeType = 3;
  },
  components: {
    scroll,
    loading
  },
  computed: {
    // 获取title
    shortCutList () {
      return this.data.map((group) => {
        return group.title.substring(0, 1);
      });
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return '';
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY (newY) {
      const listHeight = this.listHeight;
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 在中间滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        // 获取index
        if ((-newY) < height2 && (-newY) >= height1) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          return;
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = this.listHeight.length - 2;
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLEHEIGHT) ? newVal - TITLEHEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixedTop.style.transform = `translate3d(0,${fixedTop}px,0)`;
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item); // 开发一个事件，将数据传输出去
    },
    onShortTouchStart (e) {
      let index = getData(e.target, 'index');
      this.touch.y1 = e.touches[0].pageY;
      this.touch.anchorIndex = index;
      this._scrollTo(index);
    },
    onShortTouchMove (e) {
      this.touch.y2 = e.touches[0].pageY;
      let dalta = this.touch.y2 - this.touch.y1 / ANCHORHEIGHT | 0; // 向下取整
      let index = parseInt(this.touch.anchorIndex) + dalta;
      this._scrollTo(index);
    },
    scroll (pos) {
      this.scrollY = pos.y;
    },
    _calculateHeight () {
      this.listHeight = [];
      let list = this.$refs.listgroup;
      // 获取listgroup的总高度 获取每个listGroup的高度
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight;
        this.listHeight.push(height);
      }
    },
    _scrollTo (index) {
      // 拖动到顶部
      if (!index && index !== 0) {
        return;
      }
      // 拖动到底部
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }
      this.scrollY = -this.listHeight[index];
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 2);
    },
    refresh () {
      this.$refs.listview.refresh();
    }
  }
};
</script>

<style lang='stylus'>
@import '../../common/stylus/variable'
.listview
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background
  .list-group-title
    padding-left: 20px;
    line-height: 20px;
    color: rgba(255, 255, 255, 0.5);
    background: #333;
  .list-group-item
    display: flex;
    align-items: center;
    padding: 10px 0 10px 20px;
    .avatar
      margin-right: 20px;
      height: 50px;
      width: 50px;
      border-radius: 50%;
    .name
      color: rgba(255, 255, 255, 0.5);
  .list-shortcut
    z-index: 30;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    color: #fff;
    .item
      padding: 3px 10px;
      line-height: 1em;
      color: rgba(255, 255, 255, 0.5);
      &.current
       color: #ffcd32;
  .list-fixed
    position: absolute;
    top: -1px;
    left: 0;
    width: 100%;
    .title
      padding-left: 20px;
      line-height: 20px;
      color: rgba(255, 255, 255, 0.5);
      background: #333;
  .loading-container
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);

</style>
