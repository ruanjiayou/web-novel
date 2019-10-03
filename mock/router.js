const _ = require('lodash')
const path = require('path')
const sleep = require('./utils/sleep')
const loader = require('./utils/loader')
const adjustRoutes = require('./utils/adjustRoutes')
const config = require('./config')
let routes = []
/**
 * 处理路由文件
 * @param {object} info 路径信息
 */
function handler(info) {
  let route = require(info.fullpath)
  Object.keys(route).forEach(key => {
    // 转化为可以排序的对象
    const [method, apipath] = key.split(' ')
    //app[method](apipath, route[key]);
    const o = {
      type: method.toLowerCase(),
      path: apipath,
      handle: route[key]
    }
    routes.push(o)
  })
}
/**
 * 加载所有路由
 */
loader({
  dir: path.normalize(__dirname + '/routes'),
  recusive: true
}, handler)

module.exports = function (app) {
  // 排序
  routes = adjustRoutes(routes)
  // 挂载到app上
  routes.forEach((route) => {
    app[route.type](route.path, async function (req, res, next) {
      // 普通API
      try {
        if (config.sleep) {
          await sleep(config.sleep)
        }
        const result = await route.handle.call(app, req, res, next)
        // 处理列表分页
        if (result !== undefined) {
          res.json(result)
        }
      } catch (e) {
        next(e)
      }
    })
  })
}