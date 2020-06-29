import React, { useContext as useReactContext, useState } from 'react'
import mem from 'mem'
import qs from 'qs'
import _ from 'lodash'
import store from 'global-state'

export function pathname2views(url) {
  const [pathname, querystring = ''] = url.split('?')
  const views = [];
  const arr = pathname.replace('/root/', '').split('/')
  const query = qs.parse(querystring, { allowDots: true })
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
const memGetViewModel = mem(function (view) {
  return store.viewModels.get(view)
})

export function useProvider(history) {
  let [state] = useState(() => {
    let route = {
      history,
      getPage(view) {
        const ps = history.location.pathname.split('?')[0]
        const p = ps.split('/')[2]
        const Page = memGetViewModel(view || p)
        return Page.Comp;
      },
      getStateKey(key) {
        return history.location.state && history.location.state[key]
      },
      getQuery(uri) {
        const url = history.location.pathname + history.location.search;
        const [pathname, querystring = ''] = (uri || url).split('?')
        return qs.parse(querystring, { allowDots: true })
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
        if (store.layers.length) {
          const views = pathname2views(history.location.pathname + history.location.search)
          views.pop();
          store.setLayers(views);
          route.history.goBack();
        } else {
          route.history.goBack();
        }
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
          store.setLayers(views);
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
          store.setLayers(views);
          const pathname = views2pathname(views)
          history.replace({
            pathname: pathname,
            state,
          })
        }

      },
      boot(location) {
        const views = pathname2views(location.pathname + location.search)
        store.setLayers(views);
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
