const localforage = require('localforage')

class Recorder {
  constructor(ns, opt) {
    this.ns = ns
    this.api = localforage.createInstance({ name: ns })
  }
  async getValue(key) {
    return await this.api.getItem(key)
  }
  async setValue(key, data, option) {
    await this.api.setItem(key, { data, option: { ts: Date.now(), ...option } })
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
      result.push(value)
    })
    return result.sort((a, b) => {
      return b.option.ts - a.option.ts
    })
  }
}

export default Recorder