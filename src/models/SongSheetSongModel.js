import { types, getSnapshot } from 'mobx-state-tree'

const SongSheetSongModel = types.model('SongSheetSong', {
  id: types.string,
  ssid: types.string,
  uid: types.optional(types.string, ''),
  uname: types.string,
  title: types.string,
  url: types.string,
  poster: types.string,
  // playing: types.optional(types.boolean, false),
  order: types.optional(types.number, 0),
}).views(self => ({
  
})).actions(self => ({
  // toggleStatus(status) {
  //   if (status !== undefined) {
  //     self.playing = status
  //   } else {
  //     self.playing = !self.playing
  //   }
  // },
})).actions(self => ({
  toJSON() {
    let node = getSnapshot(self)
    return node
  }
}))

export default SongSheetSongModel