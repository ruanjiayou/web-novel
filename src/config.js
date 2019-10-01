export default {
  isDebug() {
    return process.env.NODE_ENV !== 'production';
  },
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
      path: '/root/user/book-shelf',
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
      path: '/root/user/my',
      title: '我的',
      icon: 'FaUserAlt'
    },
  ]
};