import { types } from 'mobx-state-tree'
import shttp from '../utils/shttp'
import storage from '../utils/storage'
import TabModel from './TabModel'
import Group from './GroupTreeModel'

const Model = types.model({
  booting: types.optional(types.boolean, true),
  // 默认tabBar
  selectedMenu: types.optional(types.string, 'home'),
  // 底部tabBars菜单
  tabs: types.optional(types.array(TabModel), []),
  // 首页tabs
  channels: types.optional(types.array(Group), []),
  // 当前tab
  tab: types.optional(types.string, ''),
  fullScreen: types.optional(types.boolean, false),
  accessTokenName: types.optional(types.string, 'access-token'),
  refreshTokenName: types.optional(types.string, 'refresh-token'),
  lockerName: types.optional(types.string, 'locker'),
  baseURL: types.optional(types.string, '/'),
  // 账号相关
  account: types.optional(types.string, ''),
  accessToken: types.optional(types.string, ''),
  refreshToken: types.optional(types.string, ''),
  // 音乐播放器相关
  musicModeName: types.optional(types.string, 'circle'),
  showMusic: false,
  // 调试
  showDebug: types.optional(types.boolean, false),
  leaveTS: types.optional(types.number, Date.now() - 60 * 6),
  // 语音测试
  showSpeaker: types.optional(types.boolean, false),
  // 软件锁相关
  config: types.model({
    isLockerOpen: types.optional(types.boolean, true),
    isLockerLocked: types.optional(types.boolean, false),
    lockerLength: types.optional(types.number, 6),
    lockerSeconds: types.optional(types.number, 1000 * 60 * 30),
    lockerPin: types.optional(types.string, '789654'),
  }, {}),
}).views(self => ({
  get isLogin() {
    return !!self.accessToken
  },
})).actions(self => {
  // locker相关操作
  return {
    initLocker(opt = {}) {
      for (let k in opt) {
        self.config[k] = opt[k]
      }
    },
    setLocker(lock) {
      self.config.isLockerOpen = lock
      storage.setValue(self.lockerName, self.config)
    },
    setLocked(locked) {
      self.config.isLockerLocked = locked
      storage.setValue(self.lockerName, self.config)
    },
    setLockerPin(pin) {
      self.config.lockerPin = pin
      storage.setValue(self.lockerName, self.config)
    },
    setLockerLength(len) {
      self.config.lockerLength = len
      storage.setValue(self.lockerName, self.config)
    },
    setLockerSeconds(seconds) {
      self.config.lockerSeconds = seconds
      storage.setValue(self.lockerName, self.config)
    },
  }
}).actions(self => {
  return {
    setBaseURL(url) {
      self.baseURL = url
      shttp.defaults.baseURL = url
      storage.setValue('baseURL', url)
    },
    resetLeaveTS() {
      self.leaveTS = Date.now()
    }
  }
}).actions(self => {
  // 用户相关配置
  return {
    logout() {
      self.accessToken = ''
      self.refreshToken = ''
      storage.removeKey(self.accessTokenName)
      storage.removeKey(self.refreshTokenName)
    },
    setAccessToken(token) {
      // {"type":"string","value":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlkIjoxLCJ0b2tlbiI6ImIyNGE3MjFhMGZkZDEzZmYwNTc2OTMzMzUyZGMwNzhiYmM3NTUxNGMiLCJpYXQiOjE1NjU1MjAxMDYsImV4cCI6MTU2NTYwNjUwNn0.FxS0gcrtuNkpCPM6LQ1Al7DLUWEEW7v77IKEitXORN4"}
      self.accessToken = token
      storage.setValue(self.accessTokenName, token)
    },
    setRefreshToken(token) {
      self.refreshToken = token
      storage.setValue(self.refreshTokenName, token)
    }
  }
}).actions(self => ({
  setMusicModeName(type) {
    storage.setValue(self.musicModeName, type)
  },
  toggleDebug() {
    self.showDebug = !self.showDebug
  },
  toggleMusic() {
    self.showMusic = !self.showMusic
  },
  toggleSpeaker() {
    self.showSpeaker = !self.showSpeaker
  },
})).actions(self => ({
  booted() {
    self.booting = false
  },
  setMenu(name) {
    self.selectedMenu = name
  },
  setTab(name) {
    self.tab = name
  },
  setTabs(tabs) {
    self.tabs = tabs
  },
  setChannels(channels) {
    self.channels = channels
  },
}))

export default Model