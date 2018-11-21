<template>
  <div class="search-history">
    <transition-group tag='ul' name='list'>
      <li :key='item' @click='selectItem(item)' class="search-item" v-for='item in list'>
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop='deleteStorage(item)'>
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script type='ECMAScript6'>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    deleteStorage (text) {
      // 删除搜索历史
      this.$emit('deleteSearch', text);
    },
    selectItem (query) {
      this.$emit('select', query);
    }
  }
};
</script>

<style lang='stylus'>
@import '../../common/stylus/variable'
@import '../../common/stylus/mixin'
.search-history
  width: 100%;
  height: 100%;
  overflow: hidden;
  .search-item
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    height: 40px;
    width: 100%;
    color: $color-text-d;
    overflow: hidden;
    &.list-enter-active,&.list-leave-active
      transition: all 0.3s;
    &.list-enter,&.list-leave-to
      height: 0;
    .text
      flex: 1;
      no-wrap();
    .icon
      flex: 0 0 30px;
      font-size: $font-size-small;
</style>
