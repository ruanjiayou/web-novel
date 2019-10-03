import CategoryPage from 'pages/CategoryPage'
import BookInfoPage from 'pages/BookInfoPage'
import BookCatalogPage from 'pages/BookCatalogPage'
import BookChapterPage from 'pages/BookChapterPage'

import HomePage from 'pages/HomePage'
import AuthLoginPage from 'pages/AuthLoginPage'
import UserCenterPage from 'pages/UserCenterPage'
import BookShelfPage from 'pages/UserShelfPage'
import BookSearchPage from './BookSearchPage'

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
    pathname: '/root/book/:id([0-9a-zA-Z-]+)/chapter/:chapter([0-9a-zA-Z-]+)/',
    component: BookChapterPage,
  },
  {
    pathname: '/root/book/search',
    component: BookSearchPage,
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
]
