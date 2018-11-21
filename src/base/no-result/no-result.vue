<template>
  <div class="no-result">
      <div class="no-result-icon"></div>
      <p class="no-result-desc">{{title}}</p>
  </div>
</template>

<script type='ECMAScript6'>
export default {
  props: {
    title: {
      type: String,
      default: '没有查询到任何数据'
    }
  }
};
</script>

<style lang='stylus'>
@import '../../common/stylus/variable'
@import '../../common/stylus/mixin'
.no-result
  width: 100%;
  text-align: center;
  .no-result-icon
    width: 86px;
    height: 90px;
    margin: 0 auto;
    background-size: 86px 90px;
    bg-image('no-result');
  .no-result-desc
    margin-top: 30px;
    line-height: 20px;
    color: $color-text-d;
    font-size: $font-size-medium
</style>
