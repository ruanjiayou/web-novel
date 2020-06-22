import React, { useContext as useReactContext, useState } from 'react'
import * as path2reg from 'path-to-regexp'
import pages from '../../pages'
import qs from 'qs'
import _ from 'lodash'

export function getQuery(querystring) {
  const obj = qs.parse(querystring)
  const query = {};
  for (let k in obj) {
    _.set(query, k, obj[k]);
  }
  return query;
}
export function pathname2views(url) {
  const [pathname, querystring = ''] = url.split('?')
  const views = [];
  const arr = pathname.replace('/root/', '').split('/')
  const query = getQuery(querystring)
  arr.forEach(item => {
    views.push({
      view: item,
      params: query[item] || {},
    })
  })
  return views;
}

export function views2pathname(views) {
  let paths = [];
  let query = {};
  views.forEach(view => {
    paths.push(view.view);
    for (let k in view.params) {
      query[`${view.view}.${k}`] = view.params[k]
    }
  })
  return ('/root/' + paths.join('/') + '?' + qs.stringify(query)).replace(/\?$/, '')
}

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
      getQuery() {
        return getQuery(history.location.search.substr(1))
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
      back() {
        route.history.goBack()
      },
      pushView(view, params = {}, state) {
        if (view.startsWith('/')) {
          history.push({
            pathname: view,
            state,
          })
        } else {
          const views = pathname2views(history.location.pathname + history.location.search)
          views.push({ view, params });
          const pathname = views2pathname(views)
          history.push({
            pathname,
            state,
          })
        }
      },
      replaceView(view, params = {}, state) {
        if (view.startsWith('/')) {
          history.replace({
            pathname: view,
            state,
          })
        } else {
          const views = pathname2views(history.location.pathname + history.location.search)
          views.pop();
          views.push({ view, params });
          const pathname = views2pathname(views)
          history.replace({
            pathname: pathname,
            state,
          })
        }

      },
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
