export function shuffle (arr) {
  // 洗牌函数
  let _arr = arr.slice();
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomIndex(0, i);
    let temp = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = temp;
  }
  return _arr;
}

// 获取一个随机的索引
function getRandomIndex (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// 节流函数 func 只会调用一次
export function debounce (func, delay) {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
