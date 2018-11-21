<template>
  <transition name='slider'>
    <!-- <div class="singer-detail">
    </div> -->
    <music-list :songs='songs' :title='title' :bgImage='bgImage'></music-list>
  </transition>
</template>

<script type='ECMAScript6'>
import MusicList from 'components/music-list/music-list';
import {getDisc} from 'api/recommend';
import {ERR_OK} from 'api/config';
import {mapGetters} from 'vuex';

export default {
  data () {
    return {
      songs: []
    };
  },
  computed: {
    title () {
      return this.disc.dissname;
    },
    bgImage () {
      return this.disc.imgurl;
    },
    ...mapGetters([
      'disc'
    ])
  },
  components: {
    'music-list': MusicList
  },
  created () {
    this._getdisc();
  },
  methods: {
    _getdisc () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend');
        return;
      }
      getDisc(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data);
          this.songs = res.data.cdlist[0].songlist;
        }
      });
    }
  }
};
</script>

<style lang='stylus'>
.slider-enter-active, .slider-leave-active
  transition: all 0.5s;
.slider-enter, .slider-leave-to
  transform: translate3d(100%, 0, 0);
</style>
