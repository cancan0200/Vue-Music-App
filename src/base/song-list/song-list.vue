<template>
  <div class='song-list'>
    <ul>
      <li class="item" @click='selectItem(song, index)' v-for="(song, index) in songs" v-bind:key='song.id'>
        <div class="rank-top" v-show="rank">
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h1 class="name">{{song.name}}</h1>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type='ECMAScript6'>
export default {
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getDesc (song) {
      return `${song.singer}-${song.album}`;
    },
    selectItem (song, index) {
      this.$emit('select', song, index);
    },
    getRankCls (index) {
      if (index <= 2) {
        return `icon icon-${index}`;
      } else {
        return 'text';
      }
    },
    getRankText (index) {
      if (index > 2) {
        return `${index + 1}`;
      } else {
        return '';
      }
    }
  }
};
</script>

<style lang='stylus'>
@import '../../common/stylus/variable'
@import '../../common/stylus/mixin'
.song-list
  .item
    display: flex;
    height: 60px;
    width: 100%;
    align-items: center;
    justify-content: middle;
    box-sizing: border-box;
    font-size: $font-size-medium;
    line-height: 1.5em;
    .rank-top
      flex: 0 0 25px;
      width: 25px;
      height: 60px;
      margin-right: 20px;
      text-align: center;
      .icon
        display: inline-block;
        margin-top: 10px;
        width: 24px;
        height: 25px;
        background-size: 25px 24px;
        &.icon-0
          bg-image('first');
        &.icon-1
          bg-image('second');
        &.icon-2
          bg-image('third');
      .text
        line-height: 60px;
        color: $color-theme;
        font-size: $font-size-large;
    .content
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
      flex: 1;
      padding-bottom: 5px;
      line-height: 20px;
      border-bottom: 1px solid $color-highlight-background;
      .name
        no-wrap();
        color: $color-text-ll;
      .desc
        no-wrap();
        margin-top: 4px;
        color: $color-text-d;
        font-size: $font-size-small;
</style>
