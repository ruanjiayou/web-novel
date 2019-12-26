import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { useStoreContext, createRouteProvider, createNaviProvider, createMusicPlayerProvider, createDebugProvider, createSpeakerProvider } from 'contexts'
import { LockerView } from 'components'
import Layout from './layout'

import pages from 'pages'

// 路由=>组件.没登录跳到登录.登录了匹配root.匹配失败就重定向route.

function App(props) {
  const store = useStoreContext()
  const [router, RouterContext] = createRouteProvider(props.history)
  const [navi, NaviContext] = createNaviProvider()
  const [MusicPlayer] = createMusicPlayerProvider()
  const [Debug] = createDebugProvider()
  const [Speaker] = createSpeakerProvider()
  // 默认是home
  const name = props.location.pathname.split('/').pop()
  if (store.app.selectedMenu !== name) {
    store.app.setMenu(name)
  }
  return <RouterContext.Provider value={router}>
    <NaviContext.Provider value={navi}>
      <Observer>{
        () => {
          // FIXME: 不再强制登录了
          // if (!store.app.isLogin && props.location.pathname.startsWith('/root')) {
          //   return <Redirect to={'/auth/login'}></Redirect>
          // } else if (store.app.isLogin) {
          //   if (store.app.config.isLockerOpen && store.app.config.isLockerLocked) {
          //     return <LockerView />
          //   }
          // }
          if (store.app.config.isLockerOpen && store.app.config.isLockerLocked) {
            return <LockerView />
          }
          return <Fragment>
            <MusicPlayer />
            <Debug />
            <Speaker />
            <Layout>
              <Switch>
                {/* <Route path={'/root/*'} component={AppRoot}></Route> */}
                {pages.map(page => <Route key={page.pathname} path={page.pathname} component={page.component}></Route>)}
                <Route component={NoMatch}></Route>
              </Switch>
            </Layout>
          </Fragment>
        }
      }</Observer>
    </NaviContext.Provider>
  </RouterContext.Provider>
}

function NoMatch() {
  return <Redirect to={'/root/home'}></Redirect>
  // FIXME: 不再强制登录了
  // const store = useStoreContext()
  // if (store.app.isLogin) {
  //   return <Redirect to={'/root/home'}></Redirect>
  // } else {
  //   return <Redirect to={'/auth/login'}></Redirect>
  // }
}

export default function Index() {
  return <BrowserRouter basename={'/'}>
    <Route path={'/*'} component={App}></Route>
  </BrowserRouter>
}