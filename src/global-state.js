import AppModel from 'models/AppModel';
import UserLoader from 'loader/UserLoader';
import CategoryLoader from 'loader/CategoryLoader'
import BookShelfLoader from 'loader/BookShelfLoader';

import Config from 'config.js'
import shttp from 'utils/shttp';
import storage from 'utils/storage';

shttp.defaults.baseURL = storage.getValue('baseURL') || (Config.isDebug ? Config.config.development.host : Config.config.production) || '';
// 全局状态.
const app = AppModel.create({
  baseURL: shttp.defaults.baseURL,
  config: {}
});
app.setAccessToken(storage.getValue(app.accessTokenName) || '');
app.setRefreshToken(storage.getValue(app.refreshTokenName) || '');
app.initLocker(storage.getValue(app.lockerName) || {});
const target = {};

// loader
const userLoader = UserLoader.create();
const categoryLoader = CategoryLoader.create();
const bookShelfLoader = BookShelfLoader.create();

export default {
  app,
  target,
  userLoader,
  categoryLoader,
  bookShelfLoader,
};