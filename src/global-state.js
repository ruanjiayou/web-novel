import AppModel from 'models/AppModel'
import DebugModel from 'models/DebugModel'
import ViewModel from 'models/ViewModel'
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
import { groups } from 'pages'
import config from './config'
import { ws } from './utils/ws'

export const channelLoaders = {}
export const resourceListLoaders = {}
const Store = types.model('store', {
  ts: types.number,
  app: AppModel,
  debug: DebugModel,
  music: MusicPlayerModel,
  speaker: SpeakerModel,
  userLoader,
  lineLoader,
  categoryLoader,
  bookShelfLoader,
  groupListLoader,
  layers: types.array(types.model('layer', {
    view: types.string,
    params: types.frozen({})
  })),
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
  // 多层覆盖 不放这里启动时无法更新变化
  setLayers(layers) {
    self.layers = layers
  },
  setTs() {
    self.ts = Date.now()
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
  ts: Date.now(),
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
  viewModels: groups,
})

window.store = store
window.ws = ws
storage.prefix = store.app.storagePrefix
store.app.setAccessToken(storage.getValue(store.app.accessTokenName) || '')
store.app.setRefreshToken(storage.getValue(store.app.refreshTokenName) || '')
store.app.initLocker(storage.getValue(store.app.lockerName) || {})
store.app.setBaseURL(config.isDebug ? 'http://localhost:8097' : '')
store.music.setMode(storage.getValue(store.app.musicModeName) || 'circle')

window.onpopstate = function () {
  store.setTs()
}

export default store