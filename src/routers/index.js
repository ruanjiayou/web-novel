import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import React from 'react'
import { Observer } from 'mobx-react-lite'
import { useStoreContext } from 'contexts/store'
import { useProvider } from 'contexts/router'

// import store from 'global-state';
import Locker from 'components/LockerView'

import LayoutNormal from 'Layout/Normal'

import pages from 'pages'

// 路由=>组件.没登录跳到登录.登录了匹配root.匹配失败就重定向route.

function App(props) {
  const store = useStoreContext()
  const [router, RouterContext] = useProvider(props.history)
  // 默认是home
  const name = props.location.pathname.split('/').pop()
  if (store.app.selectedMenu !== name) {
    store.app.setMenu(name)
  }
  return <RouterContext.Provider value={router}>
    <Observer>{
      () => {
        if (!store.app.isLogin && props.location.pathname.startsWith('/root')) {
          return <Redirect to={'/auth/login'}></Redirect>
        } else if (store.app.isLogin) {
          if (store.app.config.isLockerOpen && store.app.config.isLockerLocked) {
            return <Locker />
          }
        }
        return <LayoutNormal>
          <Switch>
            {/* <Route path={'/root/*'} component={AppRoot}></Route> */}
            {pages.map(page => <Route key={page.pathname} path={page.pathname} component={page.component}></Route>)}
            <Route component={NoMatch}></Route>
          </Switch>
        </LayoutNormal>
      }
    }</Observer>
  </RouterContext.Provider>
}

function NoMatch() {
  const store = useStoreContext()
  if (store.app.isLogin) {
    return <Redirect to={'/root/home'}></Redirect>
  } else {
    return <Redirect to={'/auth/login'}></Redirect>
  }
}

export default function Index() {
  return <BrowserRouter basename={'/'}>
    <Route path={'/*'} component={App}></Route>
  </BrowserRouter>
}