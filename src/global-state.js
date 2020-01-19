import AppModel from 'models/AppModel'
import DebugModel from 'models/DebugModel'
import MusicPlayerModel from 'models/MusicPlayerModel'
import SpeakerModel from 'models/SpeakerModel'
import UserLoader from 'loader/UserLoader'
import LineLoader from 'loader/LineLoader'
import CategoryLoader from 'loader/CategoryLoader'
import BookShelfLoader from 'loader/BookShelfLoader'
import GroupListLoader from 'loader/GroupListLoader'

import storage from './utils/storage'
console.log('globalStore')
// 全局状态.
const app = AppModel.create({
  baseURL: '',
  config: {},
  music: { url: '' },
})
app.setAccessToken(storage.getValue(app.accessTokenName) || '')
app.setRefreshToken(storage.getValue(app.refreshTokenName) || '')
app.initLocker(storage.getValue(app.lockerName) || {})
app.setBaseURL(storage.getValue('baseURL') || '')
const target = {}
// TODO: 记录mode
const music = MusicPlayerModel.create({
  mode: storage.getValue(app.musicModeName) || 'circle',
})
const speaker = SpeakerModel.create({})
const debug = DebugModel.create({})
// loader
const userLoader = UserLoader.create()
const lineLoader = LineLoader.create()
const categoryLoader = CategoryLoader.create()
const bookShelfLoader = BookShelfLoader.create()
const groupListLoader = GroupListLoader.create()

export default {
  app,
  debug,
  music,
  speaker,
  target,
  userLoader,
  lineLoader,
  categoryLoader,
  bookShelfLoader,
  groupListLoader,
  // 全局loader缓存
  channelLoaders: {},
  resourceListLoaders: {},
}