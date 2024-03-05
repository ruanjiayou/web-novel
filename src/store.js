import AppModel from 'models/AppModel';
import DebugModel from 'models/DebugModel';
import ViewModel from 'models/ViewModel';
import MusicPlayerModel from 'models/MusicPlayerModel';
import SpeakerModel from 'models/SpeakerModel';
import userLoader from 'loader/UserLoader';
import lineLoader from 'loader/LineLoader';
import categoryLoader from 'loader/CategoryLoader';
import bookShelfLoader from 'loader/BookShelfLoader';
import groupListLoader from 'loader/GroupListLoader';
import GroupTreeLoader from 'loader/GroupTreeLoader';
import ResourceListLoader from 'loader/ResourceListLoader';

import storage from './utils/storage';
import { types } from 'mobx-state-tree';
import { groups } from 'pages';
import config from './config';
// import { ws } from './utils/ws'

export const channelLoaders = {};
export const resourceListLoaders = {};
const Store = types
  .model('store', {
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
    // pages & groups 下面是给src/page-group-loader-model/base.js 用的
    viewModels: types.map(ViewModel),
  })
  .actions((self) => ({
    ready(data) {
      if (data.user) {
        self.userLoader.setData(data.user);
      }
      self.lineLoader.setData(data.lines);
      self.app.setTabs(data.tabs);
      self.app.setChannels(data.channels);
      data.channels.forEach((channel) => {
        channelLoaders[channel.group_id] = GroupTreeLoader.create();
        resourceListLoaders[channel.group_id] = ResourceListLoader.create();
      });
      setTimeout(() => {
        self.app.setBoot(false);
      }, 500);
    },
    setTs() {
      self.ts = Date.now();
    },
    afterCreate() {
      storage.prefix = self.app.storagePrefix;

      const mode = storage.getValue('music-mode') || 'circle';
      self.music.setMode(mode);

      self.app.setAccessToken(storage.getValue(self.app.accessTokenName) || '');
      self.app.setRefreshToken(
        storage.getValue(self.app.refreshTokenName) || '',
      );
      self.app.initLocker(storage.getValue(self.app.lockerName) || {});
    },
  }))
  .views((self) => ({
    get channelLoaders() {
      return channelLoaders;
    },
    get resourceListLoaders() {
      return resourceListLoaders;
    },
  }));

const store = Store.create({
  ts: Date.now(),
  app: {
    baseURL: '',
    config: {},
  },
  music: {},
  speaker: {},
  debug: {},
  viewModels: groups,
});

window.store = store;
// window.ws = ws

store.app.setBaseURL(
  config.isDebug ? 'http://192.168.0.124/gw/novel' : '/gw/novel',
);
export default store;
