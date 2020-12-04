import { types, getSnapshot } from 'mobx-state-tree'
import events from 'utils/events'
import store from '../global-state'
import MarkedSong from './SongSheetSong'

const Model = types.model('musicPlayer', {
  item: types.maybe(MarkedSong),
  // 当前状态
  state: types.optional(types.enumeration(['paused', 'playing', 'loading', 'ended']), 'paused'),
  isLoading: types.optional(types.boolean, false),
  // 当前播放模式
  mode: types.optional(types.string, 'list'),
  MODE: types.frozen({
    ONE: 'one',
    RANDOM: 'random',
    LIST: 'list',
    CIRCLE: 'circle'
  }),
  // 事件
  event: types.optional(types.frozen(), {
    PLAY: 'music-play',
    PLAY_SINGLE: 'music-play-single',
    PAUSE: 'music-pause',
  }),
  // 当前播放列表.播放记录和歌单列表
  playList: types.array(MarkedSong),

  currentPlayId: types.optional(types.string, ''),
  single: false,
}).views(self => ({
  // 当前播放音频资源id
  get currentId() {
    if (self.item) {
      return self.item.id;
    } else {
      return '';
    }
  },
  // 当前播放音频资源文件路径
  get currentUrl() {
    if (self.item) {
      return store.lineLoader.getHostByType('image') + self.item.url;
    } else {
      return '';
    }
  },
})).actions(self => {
  // 音乐播放器相关
  return {
    loadList(items) {
      self.playList = items.map(item => item.toJSON())
    },
    append(item) {
      self.playList.push(item);
    },
    remove(id) {
      const i = self.playList.findIndex(item => item.id === id);
      if (self.playList.length === 0) {
        self.playList = [];
        self.item = null;
      } else if (i !== -1) {
        self.playNext();
        self.playList.splice(i, 0, 1);
      }
    },
    setMode(mode) {
      self.mode = mode;
    },
    setState(state) {
      self.state = state;
    },
    // 1.1播放全部 手动事件调用
    playAll() {
      self.item = getSnapshot(self.playList[0])
      self.state = 'playing'
    },
    play(item) {
      if (item) {
        self.item = getSnapshot(item);
      }
      self.state = 'playing'
      window.audioPlayer.play();
    },
    pause() {
      self.state = 'paused'
      window.audioPlayer.pause();
    },
    // 2.1播放当前id的下一个 顺序和循环模式调用(可以处理额外的逻辑)
    // audio end事件里调用
    playNext() {
      let id = self.currentId
      let order = self.playList.findIndex(song => song.id === id)
      if (order === -1) {
        if (self.playList.length === 0) {
          return
        } else {
          self.item = getSnapshot(self.playList[0])
        }
      }
      if (self.mode === 'circle') {
        self.item = getSnapshot(self.playList[order + 1] || self.playList[0])
      } else if (order + 1 < self.playList.length) {
        self.item = getSnapshot(self.playList[order + 1])
      } else {
        // 顺序到了最后就停了
      }
    },
  }
})

export default Model