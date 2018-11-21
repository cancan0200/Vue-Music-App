<template>
  <div class="slider" ref="slider">
      <div class="slider-group" ref="sliderGroup">
          <slot></slot>
      </div>
      <div class="dots">
          <span class="dot" v-for="(item,index) in dots" :key="index" :class="{active: currentPageIndex === index}"></span>
      </div>
  </div>
</template>

<script type='ECMAScript6'>
import BScroll from 'better-scroll';
import {addClass} from 'common/js/dom';
export default {
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  props: {
    // 循环轮播
    loop: {
      type: Boolean,
      default: true
    },
    // 自动播放
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 切换的间隔时间
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted () {
    setTimeout(() => {
      this._SetSliderWidth();
      this._initDots();
      this.$nextTick(() => {
        this._initSlider();
        if (this.autoPlay) {
          this._play();
        }
      });
    }, 20);
    window.addEventListener('resize', () => {
      if (!this.scroll) {
        return;
      }
      this._SetSliderWidth(true);
      this.scroll.refresh();
    });
  },
  methods: {
    // 设置容器的宽度
    _SetSliderWidth (isResize) {
      this.children = this.$refs.sliderGroup.children;
      let width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, 'slider-item');
        child.style.width = sliderWidth + 'px';
        width += sliderWidth;
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + 'px';
    },
    _initSlider () {
      this.scroll = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false, // 关闭或者打开惯性运动的执行
        snap: true, // 隔断（翻页）
        snapLoop: this.loop, // 无限滚动
        snapThreshold: 0,
        snapSpeed: 400 // 滑动的时间
      });
      this.scroll.on('scrollEnd', () => {
        let pageIndex = this.scroll.getCurrentPage().pageX;
        if (this.loop) {
          pageIndex--;
        }
        this.currentPageIndex = pageIndex;
        if (this.autoPlay) {
          clearInterval(this.timer);
          this._play();
        }
      });
    },
    _initDots () {
      this.dots = new Array(this.children.length);
    },
    _play () {
      // let pageIndex = this.currentPageIndex - 1;
      // if (this.loop) {
      //   pageIndex++;
      // }
      // this.currentPageIndex = pageIndex;
      this.timer = setTimeout(() => {
        // this.scroll.goToPage(pageIndex, 400, 0);
        this.scroll.next();
      }, this.interval);
    }
  },
  destroyed () {
    clearTimeout(this.timer);
  }
};
</script>

<style lang='stylus'>
@import "../../common/stylus/variable"
.slider
  overflow: hidden;
  position: relative;
  .slider-group
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-item
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      a
        display: block;
        width: 100%;
        overflow: hidden;
        text-direction: none;
      img
        display: block;
        width: 100%;
  .dots
    position: absolute;
    right: 0;
    left: 0;
    bottom: 10px;
    z-index: 9;
    text-align: center;
    .dot
      display: inline-block;
      margin: 0 5px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;
      &.active
        width: 12px;
        border-radius: 5px;
        background: $color-text-ll
</style>
