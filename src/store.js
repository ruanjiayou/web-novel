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
    },
    setTs() {
      self.ts = Date.now();
    },
    afterCreate() {
      storage.prefix = self.app.storagePrefix;

      const mode = storage.getValue('music-mode') || 'circle';
      self.music.setMode(mode);

      const showDebug = storage.getValue('show-debug');
      if (!!showDebug !== self.app.showDebug) {
        self.app.toggleDebug()
      }
      const env = storage.getValue('env');
      if (["test", 'development', 'production'].includes(env)) {
        self.app.setENV(env);
      }
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

const baseURL = 'https://192.168.0.124/gw/novel';
const store = Store.create({
  ts: Date.now(),
  app: {
    baseURL: baseURL || '',
    env: 'production',
    config: {},
  },
  music: {},
  speaker: {},
  debug: {},
  viewModels: groups,
});

window.store = store;
// window.ws = ws

export default store;
