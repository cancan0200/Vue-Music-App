import storage from 'good-storage';

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LENGTH = 15;

const PLAY_KEY = '__play__';
const PLAY_MAX_LENGTH = 200;

const FAVORITE_KEY = '__favorite__';
const FAVORITE_MAX_LENGTH = 200;

// 保存搜索结果缓存到本地
export function saveSearchQuery (query) {
  // 使用npm库 storage
  let searches = storage.get(SEARCH_KEY, []);
  // 最新搜索的结果总是展示在最前面
  insertArray(searches, query, (item) => {
    return item === query;
  }, SEARCH_MAX_LENGTH);
  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function loadSearch () {
  return storage.get(SEARCH_KEY, []);
}

// 删除一个搜索历史
export function deleteOneStorage (query) {
  let searches = storage.get(SEARCH_KEY, []);
  delArr(searches, (item) => {
    return item === query;
  });
  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function clearStorage () {
  storage.remove(SEARCH_KEY);
  return [];
}

// 设置播放历史到本地缓存
export function savePlay (song) {
  let playes = storage.get(PLAY_KEY, []);
  insertArray(playes, song, (item) => {
    return item.id === song.id;
  }, PLAY_MAX_LENGTH);
  storage.set(PLAY_KEY, playes);
  return playes;
}

// 获取播放历史
export function loadPlay () {
  return storage.get(PLAY_KEY, []);
}

// 保存一首歌到我喜欢的列表中
export function saveFavorite (song) {
  let favorites = storage.get(FAVORITE_KEY, []);
  insertArray(favorites, song, (item) => {
    return item.id === song.id;
  }, FAVORITE_MAX_LENGTH);
  storage.set(FAVORITE_KEY, favorites);
  return favorites;
}

// 从我喜欢的歌曲列表中删除歌曲
export function deleteFavorite (song) {
  let favorites = storage.get(FAVORITE_KEY, []);
  delArr(favorites, (item) => {
    return song.id === item.id;
  });
  storage.set(FAVORITE_KEY, favorites);
  return favorites;
}

// 获取我喜欢的歌曲列表
export function loadFavorite () {
  return storage.get(FAVORITE_KEY, []);
}

function delArr (arr, compare) {
  let index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare);
  if (index === 0) {
    // 如果是第一个
    return;
  }
  if (index > 0) {
    // 删掉原来的搜索记录
    arr.splice(index, 1);
  }
  arr.unshift(val);
  if (maxLen && maxLen < arr.legth) {
    // 保证数组的长度为固定的
    arr.pop();
  }
}
