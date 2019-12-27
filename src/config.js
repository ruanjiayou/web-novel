export default {
  get isDebug() {
    return process.env.NODE_ENV !== 'production'
  },
  console: true,
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