import { types, getSnapshot } from 'mobx-state-tree'
import events from 'utils/events'
import Recorder from 'utils/cache'
import store from '../store'
import Resource from './ResourceModel'
import storage from '../utils/storage'
const musicRecorder = new Recorder('music')
/**
 * 播放一首歌曲 写入播放历史(如果已存在则刷新保存时间？最多100首)
 * 有歌单id就是歌单列表，没有就是历史列表
 * 缓存歌单列表的数据
 * 播放模式 列表/单曲循环/列表循环
 * 播放状态 ended/playing/paused/loading
 * 
 */
const Model = types.model('musicPlayer', {
  item: types.maybe(Resource),
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
  // 播放历史
  historyList: types.array(Resource),
  // 歌单列表
  sheetSongList: types.array(Resource),
  type: types.optional(types.string, 'history'),
}).views(self => ({
  get currentList() {
    return self.type === 'history' ? self.historyList : self.sheetSongList
  },
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
    if (self.item && self.item.audios) {
      const mt = self.item.audios.find(item => item.type === 'audio')
      return store.lineLoader.getHostByType('image') + (mt ? mt.path : '');
    } else {
      return '';
    }
  },
})).actions(self => {
  // 音乐播放器相关
  return {
    loadList(items) {
      self.currentList = items.map(item => item.toJSON ? item.toJSON() : item)
    },
    append(item) {
      self.currentList.push(item);
    },
    remove(id) {
      const i = self.currentList.findIndex(item => item.id === id);
      if (self.currentList.length === 0) {
        self.currentList = [];
        self.item = null;
      } else if (i !== -1) {
        self.playNext();
        self.currentList.splice(i, 0, 1);
      }
    },
    setMode(mode) {
      self.mode = mode;
      storage.setValue('music-mode', mode)
    },
    setState(state) {
      self.state = state;
    },
    // 1.1播放全部 手动事件调用
    playAll() {
      self.item = getSnapshot(self.currentList[0])
      self.state = 'playing'
    },
    play(item) {
      if (item.toJSON) {
        self.item = getSnapshot(item);
      } else {
        self.item = item
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
      let order = self.currentList.findIndex(song => song.id === id)
      if (order === -1) {
        if (self.currentList.length === 0) {
          return
        } else {
          self.item = getSnapshot(self.currentList[0])
        }
      }
      if (self.mode === 'circle') {
        self.item = getSnapshot(self.currentList[order + 1] || self.currentList[0])
      } else if (order + 1 < self.currentList.length) {
        self.item = getSnapshot(self.currentList[order + 1])
      } else {
        // 顺序到了最后就停了
      }
      self.state = 'playing'
    },
  }
}).actions(self => ({
  initHistory(list) {
    self.historyList = list;
  },
  loadHistory() {
    musicRecorder.getAll().then(items => {
      const list = items.map(item => item.data)
      self.initHistory(list)
    })
  },
  afterCreate() {
    self.loadHistory()
  }
}))

export default Model