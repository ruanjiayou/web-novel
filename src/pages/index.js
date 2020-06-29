import CategoryPage from './CategoryPage'
import BookInfoPage from './BookInfoPage'
import BookCatalogPage from './BookCatalogPage'
import BookChapterPage from './BookChapterPage'

import HomePage from './HomePage'
import AuthLoginPage from './AuthLoginPage'
import BookShelfPage from './UserShelfPage'
import BookSearchPage from './BookSearchPage'
import GroupTreePage from './GroupTreePage'
import UserCenterPage from './UserCenterPage'
import UserSettingPage from './UserSettingPage'
import SecurePage from './SecurePage'
import TodoPage from './TodoPage'
import TodoAddPage from './TodoAddPage'
import MusicPage from './MusicPage'
import SongSheetPage from './SongSheetPage'
import SongsPage from './SongsPage'
import ImagePage from './ImagePage'
import ArticlePage from './ArticlePage'
import GroupsPage from './GroupsPage'

const pages = [
  CategoryPage,
  BookInfoPage,
  BookCatalogPage,
  BookChapterPage,
  HomePage,
  AuthLoginPage,
  BookSearchPage,
  BookShelfPage,
  GroupTreePage,
  UserCenterPage,
  UserSettingPage,
  SecurePage,
  TodoAddPage,
  TodoPage,
  MusicPage,
  SongSheetPage,
  SongsPage,
  ImagePage,
  ArticlePage,
  GroupsPage,
]

const groups = {};
const models = {};
const views = new Map();
pages.forEach(page => {
  const view = page.group.view;
  if (!page.group.attrs) {
    page.group.attrs = {};
  }
  models[view] = page.model.named(view);
  groups[view] = page.group;
  views.set(view, page.View);
})

export {
  // 主要在global-store.js里调用
  groups,
  models,
  // 只在 base.js里调用
  views,
}