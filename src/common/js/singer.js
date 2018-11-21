export default class Singer {
  constructor ({id, mid, name}) {
    this.id = id;
    this.mid = mid;
    this.name = name;
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R150x150M000${mid}.jpg?max_age=2592000`;
  }
}
