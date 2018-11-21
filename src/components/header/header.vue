<template>
  <div class="header">
    <div class="icon"></div>
    <span class="title">Chicken</span>
    <router-link to='/user' tag='div' class="mine">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script type='ECMAScript6'>
export default {
};
</script>

<style lang='stylus'>
@import '../../common/stylus/variable'
@import '../../common/stylus/mixin'
.header
  position: relative;
  height: 30px;
  line-height : 30px;
  text-align: center;
  .icon
    display: inline-block;
    vertical-align: middle;
    width: 32px;
    height: 30px;
    background-size: 32px 30px;
    bg-image('logo');
  .title
    display: inline-block;
    vertical-align: middle;
    color: $color-theme;
  .mine
    position: absolute;
    top: 0;
    right: 0;
    height: 30px;
    width: 32px;
    .icon-mine
      color: $color-theme;
</style>
