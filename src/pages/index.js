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
    view: 'book-category',
  },
  {
    pathname: '/root/book/:id([0-9a-zA-Z-]+)/info',
    component: BookInfoPage,
    view: 'book-info',
  },
  {
    pathname: '/root/article/:id([0-9a-zA-Z-]+)/info',
    component: ArticlePage,
    view: 'article-info'
  },
  {
    pathname: '/root/book/:id([0-9a-zA-Z-]+)/catalog',
    component: BookCatalogPage,
    view: 'book-catalog',
  },
  {
    pathname: '/root/book/:bid([0-9a-zA-Z-]+)/chapter/:id([0-9a-zA-Z-]+)',
    component: BookChapterPage,
    view: 'chapter-info',
  },
  {
    pathname: '/root/book/search',
    component: BookSearchPage,
    view: 'book-search',
  },
  {
    pathname: '/root/group-tree/:name([0-9a-zA-Z-]+)',
    component: GroupTreePage,
    view: 'group-tree',
  },
  {
    pathname: '/root/groups',
    component: GroupsPage,
    view: 'groups',
  },
  {
    pathname: '/root/music',
    component: MusicPage,
    view: 'music',
  },
  {
    pathname: '/root/music-songs',
    component: SongsPage,
    view: 'songs',
  },
  {
    pathname: '/root/song-sheet/:id([0-9a-zA-Z-]+)',
    component: SongSheetPage,
    view: 'song-sheet',
  },
  {
    pathname: '/root/image/:id([0-9a-zA-Z]+)/info',
    component: ImagePage,
    view: 'image',
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
    view: 'user-secure',
  },
  {
    pathname: '/root/todos',
    component: TodoPage,
    view: 'todos',
  },
  {
    pathname: '/root/add-todo',
    component: TodoAddPage,
    view: 'add-todo',
  },
  {
    pathname: '/root/todo/:id([0-9a-zA-Z-]+)',
    component: TodoAddPage,
    view: 'todo-info',
  },
  {
    pathname: '/root/user-setting',
    component: UserSettingPage,
    view: 'user-setting',
  }
]
