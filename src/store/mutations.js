import * as types from './mutation-types';

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer;
  },
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag;
  },
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullscreen = flag;
  },
  [types.SET_PLAYLIST] (state, list) {
    state.playList = list;
  },
  [types.SET_SEQUENCELIST] (state, list) {
    state.sequenceList = list;
  },
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode;
  },
  [types.SET_CURRENTINDEX] (state, index) {
    state.currentIndex = index;
  },
  [types.SET_TOPLIST] (state, list) {
    state.topList = list;
  },
  [types.SET_SEARCH_HISTORY] (state, history) {
    state.searchHistory = history;
  },
  [types.SET_PLAY_HISTORY] (state, history) {
    state.playHistory = history;
  },
  [types.SET_FAVORITELIST] (state, list) {
    state.favoritelist = list;
  },
  [types.SET_DISC] (state, list) {
    state.disc = list;
  }
};
export default mutations;
