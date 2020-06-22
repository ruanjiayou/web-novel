import AppModel from 'models/AppModel'
import DebugModel from 'models/DebugModel'
import MusicPlayerModel from 'models/MusicPlayerModel'
import SpeakerModel from 'models/SpeakerModel'
import UserLoader from 'loader/UserLoader'
import LineLoader from 'loader/LineLoader'
import CategoryLoader from 'loader/CategoryLoader'
import BookShelfLoader from 'loader/BookShelfLoader'
import GroupListLoader from 'loader/GroupListLoader'
import GroupTreeLoader from 'loader/GroupTreeLoader'
import ResourceListLoader from 'loader/ResourceListLoader'

import storage from './utils/storage'
import { types } from 'mobx-state-tree'
import views from 'models/ViewModel'

export const userLoader = UserLoader.create()
export const lineLoader = LineLoader.create()
export const categoryLoader = CategoryLoader.create()
export const bookShelfLoader = BookShelfLoader.create()
export const groupListLoader = GroupListLoader.create()
export const channelLoaders = {}
export const resourceListLoaders = {}

const Store = types.model('store', {
  app: AppModel,
  debug: DebugModel,
  music: MusicPlayerModel,
  speaker: SpeakerModel,
  views: types.map(views),
  // target
}).actions(self => ({
  initial(data) {
    if (data.user) {
      userLoader.setData(data.user)
    }
    lineLoader.setData(data.lines)
    self.app.setTabs(data.tabs)
    self.app.setChannels(data.channels)
    data.channels.forEach(channel => {
      channelLoaders[channel.group_id] = GroupTreeLoader.create()
      resourceListLoaders[channel.group_id] = ResourceListLoader.create()
    })
    self.app.setBoot(false)
  },
})).views(self => ({
  get userLoader() {
    return userLoader
  },
  get lineLoader() {
    return lineLoader
  },
  get categoryLoader() {
    return categoryLoader
  },
  get bookShelfLoader() {
    return bookShelfLoader
  },
  get groupListLoader() {
    return groupListLoader
  },
  get channelLoaders() {
    return channelLoaders
  },
  get resourceListLoaders() {
    return resourceListLoaders
  },
}))

const store = Store.create({
  app: {
    baseURL: '',
    config: {},
    music: { url: '' },
  },
  music: {
    mode: 'circle',
  },
  speaker: {},
  debug: {},
})
window.store = store;
store.app.setAccessToken(storage.getValue(store.app.accessTokenName) || '')
store.app.setRefreshToken(storage.getValue(store.app.refreshTokenName) || '')
store.app.initLocker(storage.getValue(store.app.lockerName) || {})
store.app.setBaseURL('http://localhost:8097')
store.music.setMode(storage.getValue(store.app.musicModeName) || 'circle')

export default store;