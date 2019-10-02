export default {
  get isDebug() {
    return process.env.NODE_ENV !== 'production';
  },
  console: true,
  config: {
    production: {
      host: '/',
    },
    development: {
      host: 'http://localhost:4444',
    }
  },
  menus: [
    {
      name: 'book-shelf',
      path: '/root/user-shelf',
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
      name: 'center',
      path: '/root/user-center',
      title: '我的',
      icon: 'FaUserAlt'
    },
  ]
};