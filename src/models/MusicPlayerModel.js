import { types } from 'mobx-state-tree'
import events from 'utils/events'
import SongModel from './ResourceModel'
import store from '../global-state'

const Model = types.model('musicPlayer', {
  currentPlayId: types.optional(types.string, ''),
  mode: types.optional(types.string, 'list'),
  single: false,
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

})).actions(self => {
  // 音乐播放器相关
  return {
    setId(id) {
      self.currentPlayId = id
    },
    setSheet(items) {
      self.songs = items.map(item => item.toJSON())
    },
    setMode(type) {
      store.app.setMusicModeName(type)
      self.mode = type
    },
    getUrlById(id) {
      let url = ''
      self.songs.forEach(item => {
        if (item.id === id) {
          url = item.url
        }
      })
      return url
    },
    // 1.1播放全部
    playByIndex(index, mode) {
      if (mode) {
        this.setMode(mode)
      }
      if (self.songs[index]) {
        let id = self.songs[index].id
        self.currentPlayId = id
        events.emit(self.event.PLAY, id)
      }
    },
    // 1.2播放列表某个
    playMusic(id) {
      self.currentPlayId = id
      events.emit(self.event.PLAY, id)
    },
    // 2.1播放当前id的下一个 顺序和循环模式调用(可以处理额外的逻辑)
    playNext() {
      let id = self.currentPlayId
      let order = self.songs.findIndex(song => song.id === id)
      if (order === -1) {
        if (self.songs.length === 0) {
          return
        } else {
          order = 0
        }
      }
      if (self.mode === 'circle') {
        if (order + 1 === self.songs.length) {
          id = self.songs[0].id
        } else {
          id = self.songs[order + 1].id
        }
        self.currentPlayId = id
        events.emit(self.event.PLAY, id)
      } else if (order + 1 < self.songs.length) {
        id = self.songs[order + 1].id
        self.currentPlayId = id
        events.emit(self.event.PLAY, id)
      } else {
        // 顺序到了最后就停了
      }
    },
    // 2.2也是播放下一曲 不过是随机模式 才调用
    playRandom() {
      let order = Math.round(Math.random() * self.songs.length)
      events.emit(self.event.PLAY, self.songs[order].id)
    },
    // 3 暂停
    pauseMusic() {
      events.emit(self.event.PAUSE)
    },
  }
})

export default Model