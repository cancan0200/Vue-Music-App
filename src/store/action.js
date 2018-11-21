import * as types from './mutation-types';
import {playMode} from 'common/js/config';
import {shuffle} from 'common/js/util';
import {saveSearchQuery, deleteOneStorage, clearStorage, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache';

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCELIST, list);
  // 解决当设置歌曲播放为随机播放后，在点击列表歌曲，歌曲不对应的问题
  if (state.random === playMode.random) {
    let randomList = shuffle(list);
    commit(types.SET_PLAYLIST, randomList);
    index = findIndex(randomList, list[index]);
  } else {
    commit(types.SET_PLAYLIST, list);
  }
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
  commit(types.SET_CURRENTINDEX, index);
};

// 随机播放歌曲
export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_SEQUENCELIST, list);
  let randomList = shuffle(list);
  commit(types.SET_PLAYLIST, randomList);
  commit(types.SET_CURRENTINDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

// 向播放列表添加一首歌
export const InsertSong = function ({commit, state}, song) {
  let playlist = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  // 记录当前歌曲
  let currentSong = playlist[currentIndex];
  // 查找当前列表是否又待插入的歌曲，并返回其索引
  let fpIndex = findIndex(playlist, song);
  // 因为是插入歌曲，所以所以要加1
  currentIndex++;
  // 添加歌曲到当前索引
  playlist.splice(currentIndex, 0, song);
  if (fpIndex > -1) {
    // 如果已经存在这首歌，则把原来列表中的歌曲给删掉
    if (currentIndex > fpIndex) {
      // 当添加的歌曲在当前播放歌曲的前面
      playlist.splice(fpIndex, 1);
      currentIndex--;
    } else {
      // 当添加的歌曲在当前播放歌曲的后面
      playlist.splice(fpIndex + 1, 1);
    }
  }
  let currentSIndex = findIndex(sequenceList, currentSong) + 1;
  let fsIndex = findIndex(sequenceList, song);

  sequenceList.splice(currentSIndex, 0, song);
  if (fsIndex > -1) {
    if (fsIndex < currentSIndex) {
      sequenceList.splice(fsIndex, 1);
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }
  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_CURRENTINDEX, currentIndex);
  commit(types.SET_SEQUENCELIST, sequenceList);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

// 播放列表删除一首歌
export const deleteOneSong = function ({commit, state}, song) {
  let playlist = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  let pIndex = findIndex(playlist, song);
  playlist.splice(pIndex, 1);
  let sIndex = findIndex(sequenceList, song);
  sequenceList.splice(sIndex, 1);
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--;
  }
  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_CURRENTINDEX, currentIndex);
  commit(types.SET_SEQUENCELIST, sequenceList);
  const playingState = playlist.length > 0;
  commit(types.SET_PLAYING_STATE, playingState);
};

export const SaveSearchHistory = function ({commit}, query) {
  // 保存搜索结果到mutation
  commit(types.SET_SEARCH_HISTORY, saveSearchQuery(query));
};

export const deleteOneSearch = function ({commit}, query) {
  // 删除一条搜索历史记录
  commit(types.SET_SEARCH_HISTORY, deleteOneStorage(query));
};

export const deleteAllSearch = function ({commit}) {
  // 删除所有搜索历史记录
  commit(types.SET_SEARCH_HISTORY, clearStorage());
};

export const deleteAllPlaylist = function ({commit}) {
  // 删除所有搜索历史记录
  commit(types.SET_PLAYLIST, []);
  commit(types.SET_CURRENTINDEX, []);
  commit(types.SET_SEQUENCELIST, -1);
  commit(types.SET_PLAYING_STATE, false);
};

export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song));
};

export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITELIST, saveFavorite(song));
};

export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITELIST, deleteFavorite(song));
};

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id;
  });
}
