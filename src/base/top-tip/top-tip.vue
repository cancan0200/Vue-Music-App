<template>
  <transition name='fade'>
    <div class="top-tip" v-show="showFlag" @click.stop='hide'>
      <slot></slot>
    </div>
  </transition>
</template>

<script type='ECMAScript6'>
export default {
  data () {
    return {
      showFlag: false
    };
  },
  methods: {
    show () {
      this.showFlag = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.hide();
      }, 2000);
    },
    hide () {
      this.showFlag = false;
    }
  }
};
</script>

<style lang='stylus'>
@import '../../common/stylus/variable'
.top-tip
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 500;
  background-color: $color-dialog-background;
  &.fade-enter-active,&.fade-leave-active
    transition: all 0.2s;
  &.fade-enter,&.fade-leave-to
    transform: translate3d(0, -100%, 0);
</style>
