import LoginPage from 'pages/Auth/Login'
import BookInfoPage from 'pages/BookInfo'
import BookShelfPage from 'pages/BookShelf'
import BookCatalog from 'pages/BookCatalog'
import BookChapter from 'pages/BookChapter'
import UserCenterPage from 'pages/Center'
import IconsPage from 'pages/Icons'
import HomePage from 'pages/Home/index'
import CodePage from 'pages/Home/Code/List'
import CategoryPage from 'pages/Category'

export default [
  {
    pathname: '/auth/login',
    component: LoginPage,
  },
  {
    pathname: '/root/home',
    component: HomePage,
  },
  {
    pathname: '/root/demo',
    component: CodePage,
  },
  {
    pathname: '/root/icons',
    component: IconsPage,
  },
  {
    pathname: '/root/category',
    component: CategoryPage,
  },
  // 用户部分
  {
    pathname: '/root/user/my',
    component: UserCenterPage,
  },
  {
    pathname: '/root/book/:id([0-9a-zA-Z-]+)/info',
    component: BookInfoPage,
  },
  {
    pathname: '/root/book/:id([0-9a-zA-Z-]+)/catalog',
    component: BookCatalog,
  },
  {
    pathname: '/root/user/book-shelf',
    component: BookShelfPage,
  },
  {
    pathname: '/root/book/:id([0-9a-zA-Z-]+)/chapter/:chapter([0-9a-zA-Z-]+)/',
    component: BookChapter,
  },
];
