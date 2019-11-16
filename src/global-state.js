import AppModel from 'models/AppModel'
import DebugModel from 'models/DebugModel'
import MusicPlayerModel from 'models/MusicPlayerModel'
import UserLoader from 'loader/UserLoader'
import CategoryLoader from 'loader/CategoryLoader'
import BookShelfLoader from 'loader/BookShelfLoader'

import Config from 'config.js'
import storage from './utils/storage'
// 全局状态.
const app = AppModel.create({
  baseURL: storage.getValue('baseURL') || (Config.isDebug ? Config.config.development.host : Config.config.production) || '',
  config: {},
  music: { url: '' },
})
app.setAccessToken(storage.getValue(app.accessTokenName) || '')
app.setRefreshToken(storage.getValue(app.refreshTokenName) || '')
app.initLocker(storage.getValue(app.lockerName) || {})
const target = {}
// TODO: 记录mode
const music = MusicPlayerModel.create({
  mode: storage.getValue(app.musicModeName) || 'circle',
})
const debug = DebugModel.create({})
// loader
const userLoader = UserLoader.create()
const categoryLoader = CategoryLoader.create()
const bookShelfLoader = BookShelfLoader.create()

export default {
  app,
  debug,
  music,
  target,
  userLoader,
  categoryLoader,
  bookShelfLoader,
}