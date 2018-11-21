import {playMode} from 'common/js/config';
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache';

const state = {
  singer: {},
  playing: false,
  fullscreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  topList: [],
  disc: [],
  searchHistory: loadSearch(),
  playHistory: loadPlay(),
  favoritelist: loadFavorite()
};

export default state;
