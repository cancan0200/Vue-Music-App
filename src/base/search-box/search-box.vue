<template>
  <div class="search-box">
    <i class="icon icon-search"></i>
    <input ref='query' class="box" v-model="query" :placeholder='placeholder'>
    <i v-show="query" @click.stop='clear' class="icon icon-dismiss"></i>
  </div>
</template>

<script type='ECMAScript6'>
import {debounce} from 'common/js/util';
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲'
    }
  },
  data () {
    return {
      query: ''
    };
  },
  created () {
    // 将query传出去，告诉外部组件，query变化了
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery);
    }, 250));
  },
  methods: {
    clear () {
      this.query = '';
    },
    setQuery (query) {
      this.query = query;
    },
    blur () {
      // input聚焦
      this.$refs.query.blur();
    }
  }
};
</script>

<style lang='stylus'>
@import '../../common/stylus/variable'
.search-box
  display: flex;
  align-items: center;
  height: 40px;
  width: 100%;
  box-sizing: border-box;
  padding: 0 6px;
  border-radius: 5px;
  padding: 0 6px;
  background: $color-highlight-background;
  .icon
    color: $color-text-d;
    &.icon-search
      font-size: 24px;
    &.icon-dismiss
      extend-click();
      font-size: 16px;
  .box
    flex: 1;
    margin-right: 5px;
    padding-left: 5px;
    height: 20px;
    outline: none;
    border: 0;
    background-color:  $color-highlight-background;
    color: rgba(255,255,255,0.7);
    font-size: $font-size-medium;
    &:placeholder
      color: $color-text-d;
</style>
