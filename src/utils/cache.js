import config from '../config'
const localforage = require('localforage')

class Store {
  constructor(ns, opt) {
    this.ns = ns
    this.api = localforage.createInstance({ name: ns })
  }
  async getValue(key) {
    const result = await this.api.getItem(key)
    return result ? result.data : result
  }
  async setValue(key, data) {
    await this.api.setItem(key, { data, ts: Date.now() })
  }
  async removeKey(key) {
    await this.api.removeItem(key)
  }
  async clear() {
    await this.api.clear()
  }
  async getAll() {
    const result = []
    await this.api.iterate((value, key, index) => {
      result.push(value.data)
    })
    return result
  }
}

class Cache {
  constructor(opt = {}) {
    this.caches = {}
    for (let ns in opt) {
      this.caches[ns] = new Store(ns, opt[ns])
    }
  }
  getCache(ns) {
    return this.caches[ns]
  }
}

export default new Cache(config.cache)