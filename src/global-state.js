import AppModel from 'models/AppModel'
import DebugModel from 'models/DebugModel'
import MusicPlayerModel from 'models/MusicPlayerModel'
import SpeakerModel from 'models/SpeakerModel'
import userLoader from 'loader/UserLoader'
import lineLoader from 'loader/LineLoader'
import categoryLoader from 'loader/CategoryLoader'
import bookShelfLoader from 'loader/BookShelfLoader'
import groupListLoader from 'loader/GroupListLoader'
import GroupTreeLoader from 'loader/GroupTreeLoader'
import ResourceListLoader from 'loader/ResourceListLoader'

import storage from './utils/storage'
import { types } from 'mobx-state-tree'
import ViewModel, { viewData } from 'router/view-model'

export const channelLoaders = {}
export const resourceListLoaders = {}
const Store = types.model('store', {
  app: AppModel,
  debug: DebugModel,
  music: MusicPlayerModel,
  speaker: SpeakerModel,
  userLoader,
  lineLoader,
  categoryLoader,
  bookShelfLoader,
  groupListLoader,
  // pages & groups 下面是给src/page-group-loader-model/base.js 用的
  viewModels: types.map(ViewModel),
}).actions(self => ({
  ready(data) {
    if (data.user) {
      self.userLoader.setData(data.user)
    }
    self.lineLoader.setData(data.lines)
    self.app.setTabs(data.tabs)
    self.app.setChannels(data.channels)
    data.channels.forEach(channel => {
      channelLoaders[channel.group_id] = GroupTreeLoader.create()
      resourceListLoaders[channel.group_id] = ResourceListLoader.create()
    })
    self.app.setBoot(false)
  },
})).views(self => ({
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
  viewModels: viewData,
})

window.store = store;
store.app.setAccessToken(storage.getValue(store.app.accessTokenName) || '')
store.app.setRefreshToken(storage.getValue(store.app.refreshTokenName) || '')
store.app.initLocker(storage.getValue(store.app.lockerName) || {})
store.app.setBaseURL('http://localhost:8097')
store.music.setMode(storage.getValue(store.app.musicModeName) || 'circle')

export default store;