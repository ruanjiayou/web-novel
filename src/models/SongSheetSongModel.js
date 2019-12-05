import { types } from 'mobx-state-tree'

const SongSheetSongModel = types.model('SongSheetSong', {
  id: types.string,
  ssid: types.string,
  uid: types.optional(types.string, ''),
  uname: types.string,
  title: types.string,
  url: types.string,
  poster: types.string,
  playing: types.optional(types.boolean, false),
  order: types.optional(types.number, 0),
}).views(self => ({
  get value() {
    return {
      id: self.id,
      ssid: self.ssid,
      title: self.title,
      url: self.url,
      poster: self.poster,
      uid: self.uid,
      uname: self.uname,
    }
  },
})).actions(self => ({
  toggleStatus() {
    self.playing = !self.playing
  }
}))

export default SongSheetSongModel