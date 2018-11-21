<template>
  <div id="app">
    <v-header></v-header>
    <v-tab></v-tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type='ECMAScript6'>
import header from 'components/header/header';
import tab from 'components/tab/tab';
import player from 'components/player/player';
export default {
  name: 'App',
  components: {
    'v-header': header,
    'v-tab': tab,
    player
  }
};
</script>
<style lang='stylus'>
@import './common/stylus/base'
#app
  background: $color-background;
  color: $color-text
</style>
