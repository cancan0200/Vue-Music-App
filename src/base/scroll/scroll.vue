<template>
  <div ref='wrapper' class="scroll">
      <slot></slot>
  </div>
</template>

<script type='ECMAScript6'>
// 滚动组件 容器必须要有固定的高度
import BScroll from 'better-scroll';
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    // 上拉刷新标志位
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    // 扩展下拉刷新功能
    pulldown: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    // 确保dom已经渲染了，需要使用setTimeout
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      });
      // 监听滚动事件
      if (this.listenScroll) {
        let me = this;
        this.scroll.on('scroll', (pos) => {
          me.$emit('scroll', pos); // 添加事件
        });
      }
      // 监听是否需要上拉刷新事件
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            // 滚动到底部
            this.$emit('scrollToEnd');
          }
        });
      }
      // 监听是否需要下拉刷新事件
      if (this.pulldown) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y === 0) {
            // 滚动到顶部
            this.$emit('scrollToTop');
          }
        });
      }
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll');
        });
      }
    },
    enable () {
      this.scroll && this.scroll.enable();
    },
    disable () {
      this.scroll && this.scroll.disable();
    },
    refresh () {
      this.scroll && this.scroll.refresh();
    },
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this.refresh();
      }, 10);
    }
  }
};
</script>

<style lang='stylus'>
</style>
