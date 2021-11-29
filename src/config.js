export default {
  get isDebug() {
    return process.env.NODE_ENV !== 'production'
  },
  console: false,
  VERSION: '0.1.0',
  config: {
    production: {
      host: '',
    },
    development: {
      host: '',
    }
  },
  cache: {
    book: {},
    catalog: {},
    chapter: {},
    tree: {},
  }
}