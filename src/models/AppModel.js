import { types } from 'mobx-state-tree'
import shttp from '../utils/shttp'
import storage from '../utils/storage'

const Model = types.model({
  selectedMenu: types.optional(types.string, 'book-shelf'),
  fullScreen: types.optional(types.boolean, false),
  accessTokenName: types.optional(types.string, 'access-token'),
  refreshTokenName: types.optional(types.string, 'refresh-token'),
  lockerName: types.optional(types.string, 'locker'),
  baseURL: types.optional(types.string, '/'),

  account: types.optional(types.string, ''),
  accessToken: types.optional(types.string, ''),
  refreshToken: types.optional(types.string, ''),

  leaveTS: types.optional(types.number, Date.now() - 60 * 6),
  config: types.model({
    isLockerOpen: types.optional(types.boolean, true),
    isLockerLocked: types.optional(types.boolean, false),
    lockerLength: types.optional(types.number, 6),
    lockerSeconds: types.optional(types.number, 1000 * 60 * 5),
    lockerPin: types.optional(types.string, '789654'),
  }, {})
}).views(self => {
  return {

  }
}).actions(self => {
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
    setMenu(name) {
      self.selectedMenu = name
    },
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
})

export default Model