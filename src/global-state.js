import appModel from './models/app';
import ArticleLoader from './data-loader/articleLoader';
import CodeLoader from './data-loader/codeLoader';
import UserLoader from './data-loader/userLoader';
import BookShelfLoader from './data-loader/bookShelfLoader';

import Config from 'config.js'
import shttp from './utils/shttp';
import storage from './utils/storage';

shttp.defaults.baseURL = storage.getValue('baseURL') || (Config.isDebug() ? Config.config.development.host : Config.config.production) || '';
// 全局状态.
const app = appModel.create({
  baseURL: shttp.defaults.baseURL,
  config: {}
});
app.setAccessToken(storage.getValue(app.accessTokenName) || '');
app.setRefreshToken(storage.getValue(app.refreshTokenName) || '');
app.initLocker(storage.getValue(app.lockerName) || {});
const target = {};

// loader
const articleLoader = ArticleLoader.create();
const codeLoader = CodeLoader.create();
const userLoader = UserLoader.create();
const bookShelfLoader = BookShelfLoader.create();

export default {
  app,
  target,
  articleLoader,
  codeLoader,
  userLoader,
  bookShelfLoader,
};