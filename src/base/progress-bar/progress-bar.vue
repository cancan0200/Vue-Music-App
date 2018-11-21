<template>
  <div class="progress-bar" ref='progressBar' @click.stop='progressClick'>
    <div class="bar-inner">
      <div class="progress" ref='progress'></div>
      <div class="progress-btn-wrapper" ref='progressBtn'
      @touchstart='touchStart'
      @touchmove='touchMove'
      @touchend='touchEnd'
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type='ECMAScript6'>
import {prefixStyle} from 'common/js/dom';

const transform = prefixStyle('transform');
const progressBtnwidth = 16;
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {};
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barwidth = this.$refs.progressBar.clientWidth - progressBtnwidth;
        const width = barwidth * newPercent;
        this._offsetWidth(width);
      }
    }
  },
  methods: {
    // 小球的点击事件
    touchStart (e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    touchMove (e) {
      if (!this.touch.initiated) {
        return;
      }
      // 滑动的差值
      const daltaX = e.touches[0].pageX - this.touch.startX;
      // 进度条的差值，大于0，小于总长度
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnwidth, Math.max(0, daltaX + this.touch.left));
      this._offsetWidth(offsetWidth);
    },
    touchEnd (e) {
      this.touch.initiated = false;
      this._percentChange();
    },
    _offsetWidth (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
    },
    _percentChange () {
      const barwidth = this.$refs.progressBar.clientWidth - progressBtnwidth;
      const percent = this.$refs.progress.clientWidth / barwidth;
      this.$emit('percentChange', percent);
    },
    progressClick (e) {
      // 当点击到小圆点的时候，滚动条会切换到原点，需要修改
      // this._offsetWidth(e.offsetX);
      let offsetWidth = e.pageX - this.$refs.progressBar.getBoundingClientRect().left;
      this._offsetWidth(offsetWidth);
      this._percentChange();
    }
  }
};
</script>

<style lang='stylus'>
@import '../../common/stylus/variable'
.progress-bar
  height: 30px;
  .bar-inner
    position: relative;
    top: 13px;
    height: 4px;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.3);
    .progress
      position: absolute;
      height: 100%;
      border-radius: 5px;
      background: $color-theme;
    .progress-btn-wrapper
      position: absolute;
      left: -13px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn
        position: absolute;
        top: 7px;
        left: 7px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
</style>
