import { flow, types } from 'mobx-state-tree'
import Config from 'config'

// 根据传入的model返回model

// 默认值问题
// 第一次刷新 判断
// loader的name
// 去掉 type state枚举: init pending success fail/success: true/false state ready/pending

function createItemsLoader(model, fn, customs = {}) {
  const unionModel = types.model({
    name: types.optional(types.string, ''),
    // 数据数组
    items: types.optional(types.array(model), []),
    // 当前页码
    page: types.optional(types.number, 1),
    // 是否完毕
    isEnded: types.optional(types.boolean, false),
    // 是否加载中
    // 请求状态
    state: types.optional(types.enumeration(['ready', 'pending', 'init']), 'init'),
    // 排列方向
    sort: types.optional(types.enumeration(['asc', 'desc']), 'asc'),
    // 错误信息 success: true/false
    error: types.maybeNull(types.model('error', {
      code: types.union(types.number, types.string),
      message: types.maybe(types.string)
    })),
    option: types.frozen({ query: {} })
  }).views(self => ({
    // 默认属性
    get isEmpty() {
      return self.items.length === 0
    },
    get isLoading() {
      return self.state === 'pending'
    },
    get isError() {
      return self.error !== null
    },
  })).actions(self => ({
    // 默认方法
    setName(name) {
      self.name = name
    },
    setData(data) {
      self.items = data || []
      if (self.items.length !== 0) {
        self.state = 'ready'
      }
    },
  })).actions(self => ({
    setOption(option = {}) {
      self.option = option
    },
  })).actions(self => {
    // 自定义方法
    const nw = {}
    for (let k in customs) {
      nw[k] = function () { return customs[k].call(self, ...arguments) }
    }
    return nw
  }).actions(self => {
    // 请求
    const request = flow(function* (option = {}, type = 'refresh') {
      const { query = {}, params = {}, data = {} } = option
      if (self.isLoading) {
        return
      }
      for (let k in self.option.query) {
        if (!query[k]) {
          query[k] = self.option.query[k]
        }
      }
      self.state = 'pending'
      self.error = null
      self.page = type === 'more' ? self.page + 1 : 1
      query.page = self.page
      let res = null
      try {
        res = yield fn({ query, params, data }, type)
        let { ended, items } = res
        self.isEnded = !!ended
        if (type === 'refresh') {
          // 刷新
          if (self.sort === 'asc') {
            self.items = items
          } else {
            self.items = items.reverse()
          }
        } else if (items.length > 0) {
          // 加载更多
          if (self.sort === 'asc') {
            self.items.push(...items)
          } else {
            self.items.unshift(...items)
          }
        } else {
          self.page = self.page - 1
        }
      } catch (err) {
        if (Config.isDebug && Config.console) {
          console.log(err, 'loader')
        }
        const data = (err['response'] && err['response']['data']) || err
        // 加载失败
        if (data && data.code) {
          self.error = { code: data.code, message: data.message }
        } else {
          self.error = { code: 'unknown', message: err.message }
        }
      } finally {
        self.state = 'ready'
      }
      return res
    })
    return {
      clear() {
        self.page = 1
        self.items = []
      },
      toggleSort() {
        self.sort = self.sort === 'asc' ? 'desc' : 'asc'
        self.items = self.items.reverse()
      },
      remove(index) {
        self.items = self.items.slice().filter((item, idx) => +index !== +idx)
      },
      append(item) {
        self.items.push(item)
      },
      async refresh(option) {
        return await request(option, 'refresh')
      },
      async loadMore(option) {
        return await request(option, 'more')
      }
    }
  })

  return types.optional(unionModel, {})
}

function createItemLoader(model, fn, customs = {}) {
  const unionModel = types.model({
    item: types.maybeNull(model),
    // 请求状态
    state: types.optional(types.enumeration(['ready', 'pending', 'init']), 'init'),
    error: types.maybeNull(types.model({
      code: types.union(types.number, types.string),
      message: types.maybe(types.string),
    }))
  }).views(self => {
    // 默认属性
    return {
      get isEmpty() {
        return !self.item
      },
      get isLoading() {
        return self.state === 'pending'
      },
      get isError() {
        return self.error !== null
      },
    }
  }).actions(self => ({
    // 默认方法
    setName(name) {
      self.name = name
    },
    setData(data) {
      self.item = data
    },
  })).actions(self => {
    // 自定义方法
    const nw = {}
    for (let k in customs) {
      nw[k] = function () { return customs[k].call(self, ...arguments) }
    }
    return nw
  }).actions(self => {
    // 请求
    const request = flow(function* (option = {}, type = 'refresh', cb) {
      const { query, params, data } = option
      if (self.isLoading) {
        return
      }
      self.error = null
      self.state = 'pending'
      let res = null
      try {
        res = yield fn({ query, params, data }, type)
        if (typeof cb === 'function') {
          yield cb(res);
        }
        let { item } = res
        if (item) {
          self.item = item
        } else {
          self.error = { code: 1, message: '没有数据' }
        }
      } catch (err) {
        if (Config.isDebug && Config.console) {
          console.log(err, 'loader')
        }
        const data = (err['response'] && err['response']['data']) || err
        // 加载失败
        if (data && data.code) {
          self.error = { code: data.code, message: data.message }
        } else {
          self.error = { code: 'unknown', message: err.message }
        }
      } finally {
        self.state = 'ready'
      }
      return res
    })
    return {
      clear() {
        self.item = null
      },
      async refresh(option, cb) {
        return await request(option, 'refresh', cb)
      }
    }
  })
  return types.optional(unionModel, {})
}
export {
  createItemsLoader,
  createItemLoader,
}