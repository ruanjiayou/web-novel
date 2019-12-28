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

export default [
  {
    pathname: '/auth/login',
    component: AuthLoginPage,
  },
  {
    pathname: '/root/home',
    component: HomePage,
  },
  {
    pathname: '/root/category',
    component: CategoryPage,
  },
  {
    pathname: '/root/book/:id([0-9a-zA-Z-]+)/info',
    component: BookInfoPage,
  },
  {
    pathname: '/root/book/:id([0-9a-zA-Z-]+)/catalog',
    component: BookCatalogPage,
  },
  {
    pathname: '/root/book/:bid([0-9a-zA-Z-]+)/chapter/:id([0-9a-zA-Z-]+)',
    component: BookChapterPage,
  },
  {
    pathname: '/root/book/search',
    component: BookSearchPage,
  },
  {
    pathname: '/root/group-tree/:name([0-9a-zA-Z-]+)',
    component: GroupTreePage,
  },
  {
    pathname: '/root/music',
    component: MusicPage,
  },
  {
    pathname: '/root/music-songs',
    component: SongsPage,
  },
  {
    pathname: '/root/song-sheet/:id([0-9a-zA-Z-]+)',
    component: SongSheetPage,
  },
  {
    pathname: '/root/image/:id([0-9a-zA-Z]+)/info',
    component: ImagePage,
  },
  // 用户部分
  {
    pathname: '/root/my',
    component: UserCenterPage,
  },
  {
    pathname: '/root/shelf',
    component: BookShelfPage,
  },
  {
    pathname: '/root/secure',
    component: SecurePage,
  },
  {
    pathname: '/root/todos',
    component: TodoPage,
  },
  {
    pathname: '/root/add-todo',
    component: TodoAddPage,
  },
  {
    pathname: '/root/todo/:id([0-9a-zA-Z-]+)',
    component: TodoAddPage,
  },
  {
    pathname: '/root/user-setting',
    component: UserSettingPage,
  }
]
