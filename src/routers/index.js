import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import React from 'react'
import { Observer } from 'mobx-react-lite'
import MIconView from 'components/MIconView'
import { useStoreContext } from 'contexts/store'
import { useProvider } from 'contexts/router'
import { useProvider as useNaviProvider } from 'contexts/navi'

// import store from 'global-state';
import Locker from 'components/LockerView'

import LayoutNormal from 'Layout/Normal'

import pages from 'pages'

// 路由=>组件.没登录跳到登录.登录了匹配root.匹配失败就重定向route.

function App(props) {
  const store = useStoreContext()
  const [router, RouterContext] = useProvider(props.history)
  const [navi, NaviContext] = useNaviProvider(function () {
    return function (prop) {
      return (
        <div className="dd-common-alignside" style={{ height: 45, padding: '0 15px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-block' }}>
              <MIconView type="FaChevronLeft" onClick={() => { router.back() }} />
            </div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '600' }}>{prop.title}</div>
          <div style={{ flex: 1, textAlign: 'right' }}>{prop.children}</div>
        </div>
      )
    }
  })

  // 默认是home
  const name = props.location.pathname.split('/').pop()
  if (store.app.selectedMenu !== name) {
    store.app.setMenu(name)
  }
  return <RouterContext.Provider value={router}>
    <NaviContext.Provider value={navi}>
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
    </NaviContext.Provider>
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