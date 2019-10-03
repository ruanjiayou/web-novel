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
      name: 'category',
      path: '/root/category',
      title: '分类',
      icon: 'FaList'
    },
    {
      name: 'my',
      path: '/root/my',
      title: '我的',
      icon: 'FaUserAlt'
    },
  ]
}