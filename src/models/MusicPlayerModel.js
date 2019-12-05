import { types } from 'mobx-state-tree'
import events from 'utils/events'
import SongModel from './SongSheetSongModel'
import store from '../global-state'

const Model = types.model('musicPlayer', {
  currentPlayUrl: types.optional(types.string, ''),
  mode: types.optional(types.string, 'list'),
  single: false,
  order: types.optional(types.number, 0),
  songs: types.array(SongModel),
  mPlayer: types.frozen(),
  type: types.optional(types.frozen(), {
    CIRCLE: 'circle',
    RANDOM: 'random',
    ONE: 'one',
    LIST: 'list',
  }),
  event: types.optional(types.frozen(), {
    PLAY: 'music-play',
    PLAY_SINGLE: 'music-play-single',
    PAUSE: 'music-pause',
  }),
}).views(self => ({
  get url() {
    return self.currentPlayUrl
  },
})).actions(self => {
  // 音乐播放器相关
  return {
    setUrl(url, order = 0) {
      self.order = order
      self.currentPlayUrl = store.app.baseURL + url
    },
    setSheet(sheet) {
      self.songs = sheet
    },
    playMusicSingle(url, order = 0) {
      self.single = true
      self.order = order
      events.emit(self.event.PLAY_SINGLE, url, order)
    },
    playMusic(url, order = 0) {
      self.single = false
      self.order = order
      events.emit(self.event.PLAY, url, order)
    },
    playNext() {
      console.log(self.mode, self.order, self.songs.length)
      if (self.mode === 'circle' && self.order + 1 >= self.songs.length) {
        self.order = 0
        events.emit(self.event.PLAY, self.songs[self.order].url, self.order)
      } else if (self.order + 1 < self.songs.length) {
        self.order++
        events.emit(self.event.PLAY, self.songs[self.order].url, self.order)
      }
    },
    playRandom() {
      self.order = Math.round(Math.random() * self.songs.length)
      events.emit(self.event.PLAY, self.songs[self.order], self.order)
    },
    pauseMusic() {
      events.emit(self.event.PAUSE)
    },
    setMode(type) {
      store.app.setMusicModeName(type)
      self.mode = type
    },
  }
})

export default Model