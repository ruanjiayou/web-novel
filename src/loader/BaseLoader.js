import { flow, types } from 'mobx-state-tree'
import Config from 'config'

function createItemsLoader(model, fn) {
  const unionModel = types.model({
    // 数据数组
    items: types.optional(types.array(model), []),
    // 当前页码
    page: types.optional(types.number, 1),
    // 是否完毕
    isEnded: types.optional(types.boolean, false),
    // 是否加载中
    isLoading: types.optional(types.boolean, false),
    // 请求状态
    state: types.optional(types.enumeration(['success', 'fail']), 'success'),
    // 操作类型
    type: types.optional(types.enumeration(['refresh', 'more']), 'refresh'),
    // 排列方向
    sort: types.optional(types.enumeration(['asc', 'desc']), 'asc'),
    // 错误信息
    error: types.maybe(types.model({
      code: types.maybe(types.string),
      message: types.maybe(types.string)
    })),
  }).views(self => {
    return {
      get isEmpty() {
        return !(self.items && self.items.length > 0)
      },
      get length() {
        return self.items.length
      },
    }
  }).actions(self => {
    return {
      setData(data) {
        self.items = data || []
      }
    }
  }).actions(self => {
    const request = flow(function* (option = {}, type = 'refresh') {
      const { query = {}, params = {}, data = {} } = option
      if (self.isLoading || (self.isEnded && type === 'more')) {
        return
      }
      self.type = type
      self.error = undefined
      self.isLoading = true
      self.state = 'success'
      query.page = self.page
      let res = null
      try {
        res = yield fn({ query, params, data }, type)
        let { ended, items } = res
        self.isEnded = !!ended
        if (type === 'refresh') {
          // 刷新
          self.page = 1
          self.items = items
        } else if (items.length > 0) {
          // 加载更多
          self.page = params.page
          self.items.push(...items)
        } else {
          self.state = 'fail'
          self.error = { code: 1, message: 'x' }
        }
      } catch (err) {
        if (Config.isDebug && Config.console) {
          console.log(err, 'loader')
        }
        // 加载失败
        self.state = 'fail'
        if (err.code) {
          self.error = { code: err.code, message: err.message || err.toString() }
        } else {
          self.error = { code: 'unknown', message: '未知错误' }
        }
      } finally {
        self.isLoading = false
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
        self.page++
        return await request(option, 'more')
      }
    }
  })

  return types.optional(unionModel, {})
}

function createItemLoader(model, fn) {
  const unionModel = types.model({
    item: types.maybeNull(model),
    // 是否加载中
    isLoading: types.optional(types.boolean, false),
    // 请求状态
    state: types.optional(types.enumeration(['success', 'fail']), 'success'),
    // 操作类型
    type: types.optional(types.enumeration(['refresh']), 'refresh'),
    error: types.maybe(types.model({
      code: types.maybe(types.string),
      message: types.maybe(types.string),
    }))
  }).views(self => {
    return {
      get isEmpty() {
        return !self.item
      },
      get fn() {
        return fn
      }
    }
  }).actions(self => {
    return {
      setData(data) {
        self.item = data
      },
    }
  }).actions(self => {
    const request = flow(function* (option = {}, type = 'refresh') {
      const { query, params, data } = option
      if (self.isLoading || (self.isEnded && type === 'more')) {
        return
      }
      if (self.isLoading) {
        return
      }
      self.type = type
      self.error = undefined
      self.isLoading = true
      self.state = 'success'
      let res = null
      try {
        res = yield fn({ query, params, data }, type)
        let { item } = res
        if (item) {
          self.item = item
        } else {
          self.state = 'fail'
          self.error = { code: 1, message: 'x' }
        }
      } catch (err) {
        if (Config.isDebug && Config.console) {
          console.log(err, 'loader')
        }
        self.state = 'fail'
        if (err.code) {
          self.error = { code: err.code, message: err.message }
        } else {
          self.error = { code: 'unknown', message: '未知错误' }
        }
      } finally {
        self.isLoading = false
      }
      return res
    })
    return {
      clear() {
        self.item = null
      },
      async refresh(option) {
        return await request(option, 'refresh')
      }
    }
  })
  return types.optional(unionModel, {})
}
export {
  createItemsLoader,
  createItemLoader,
}