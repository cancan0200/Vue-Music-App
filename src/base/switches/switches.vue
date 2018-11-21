<template>
  <div class="switches">
    <ul class="switch-list">
      <li class="switch-item" v-for='(item, index) in switches' v-bind:key='index'
      :class="{'active': currentIndex === index}" @click='selectItem(index)'>
        <span>{{item.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script type='ECMAScript6'>
export default {
  props: {
    currentIndex: {
      type: Number,
      default: 0
    },
    switches: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectItem (index) {
      this.$emit('switch', index);
    }
  }
};
</script>

<style lang='stylus'>
@import "../../common/stylus/variable"
.switches
  width: 100%;
  .switch-list
    display: flex;
    align-items  center;
    width: 240px;
    margin: 0 auto;
    border: 1px solid $color-highlight-background;
    border-radius: 5px;
    .switch-item
      flex: 1;
      padding: 8px;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-text-l;
      &.active
        background: $color-highlight-background;
        color: $color-text-ll;
</style>
