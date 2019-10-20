import React, { useContext as useReactContext, useState } from 'react'
import * as path2reg from 'path-to-regexp'
import pages from '../../pages'

// 上下文context.避免react多级一直传props
const Context = React.createContext(null)
const rules = pages.map(page => {
  let url = page.pathname
  let res = { reg: path2reg(url), params: [] }
  path2reg.parse(url).forEach(it => {
    if (typeof it === 'object') {
      res.params.push(it.name)
    }
  })
  return res
})
/**
 * 使用:
 * 创建上下文
 * import useProvider from this
 * const [router, routerContext]=useProvider(history,location);
 * <routerContext.Provider value={router}>
 *   ...
 * </routerContext.Provider>
 * 使用上下文
 * import {useRouterContext} from this
 * let router = useRouterContext();
 * router.goto(...);
 */
export function useProvider(history) {
  let [state] = useState(() => {
    let route = {
      history,
      get params() {
        let res = {}
        for (let i = 0; i < rules.length; i++) {
          let rule = rules[i]
          let m = rule.reg.exec(history.location.pathname)
          if (m) {
            rule.params.forEach((name, index) => {
              res[name] = m[index + 1]
            })
            break
          }
        }
        return res
      },
      get hideMenu() {
        return history.location.state && history.location.state.hideMenu ? true : false
      },
      getStateKey(key) {
        return history.location.state && history.location.state[key]
      },
      back() {
        const { userClick, login } = history.location.state || { userClick: true }
        if (login) {
          // 登录跳转进来的页面
          route.backToRoot()
        } else if (userClick) {
          // 正常操作进入
          route.history.goBack()
        } else {
          // 可能是直接通过URL进来的
          route.backToRoot()
        }
      },
      backToRoot(params, state) {
        const { pathname, search } = getBackToRootLocation(params)
        history.push({
          pathname,
          search,
          state: {
            login: true,
            userClick: true,
            ...state
          }
        })
      },
      gotoLoginTarget() {
        // target 存于全局store中
        // 因为某种原因被强制跳到login,登录后返回原来的位置
        // getStore => 如果有则跳转,否则到首页
        // TODO:
      },
      pushView(pathname, params = {}, state) {
        state = state || {}
        state.userClick = true
        state.hideMenu = state.hideMenu === false ? false : true
        let search = ''
        for (let k in params) {
          search += `${k}=${params[k]}`
        }
        history.push({
          pathname,
          search,
          state
        })
      },
      replaceView(pathname, params = {}, state) {
        state = state || {}
        state.userClick = true
        let search = ''
        for (let k in params) {
          search += `${k}=${params[k]}`
        }
        history.replace({
          pathname,
          search,
          state
        })
      }
    }
    return route
  })
  return [state, Context]
}

export function useRouterContext() {
  return useReactContext(Context)
}

function getBackToRootLocation() {

}
