export default {
  get isDebug() {
    return process.env.NODE_ENV !== 'production'
  },
  console: true,
  config: {
    production: {
      host: '/',
    },
    development: {
      host: 'http://localhost:4445',
    }
  },
  menus: [
    {
      name: 'shelf',
      path: '/root/shelf',
      title: '书架',
      icon: 'FaBook'
    },
    {
      name: 'groups',
      path: '/root/groups',
      title: '频道',
      icon: 'FaList'
    },
    {
      name: 'music',
      path: '/root/music',
      title: '音乐',
      big: true,
      hideMenu: true,
      icon: 'FaPlayCircle'
    },
    {
      name: 'todos',
      path: '/root/todos',
      title: '任务',
      hideMenu: true,
      icon: 'FaTasks'
    },
    {
      name: 'my',
      path: '/root/my',
      title: '我的',
      icon: 'FaUserAlt'
    },
  ],
  cache: {
    book: {},
    catalog: {},
    chapter: {},
    tree: {},
  }
}