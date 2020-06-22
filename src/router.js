import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import React, { Fragment, useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useStoreContext, createRouteProvider, createNaviProvider, createMusicPlayerProvider, createDebugProvider, createSpeakerProvider } from 'contexts'
import { LockerView } from 'components'
import Layout from './layout'
import { pathname2views, views2pathname, getQuery } from 'contexts/router'
import pages from 'pages'
import { useEffectOnce } from 'react-use'
import HomePage from 'pages/HomePage'
import MinePage from 'pages/UserCenterPage'
import AuthLoginPage from 'pages/AuthLoginPage/index'

// 路由=>组件.没登录跳到登录.登录了匹配root.匹配失败就重定向route.

function AppRoot({ views, layers }) {
  return <Fragment>
    {
      views.map((view, i) => {
        const Comp = layers[view.view]
        if (i === 0) {
          return null;
        }
        if (Comp) {
          return <div key={i} style={{ width: '100%', height: '100%', position: 'absolute', zIndex: i + 99, backgroundColor: '#ffffff' }}>
            <Comp params={view.params} />
          </div>
        } else {
          return <div style={{ width: '100%', height: '100%', position: 'absolute', zIndex: i + 99, backgroundColor: '#ffffff' }} key={i}>empty: {view.view} params:{JSON.stringify(view.params)}</div>
        }
      })
    }
  </Fragment>
}

function App(props) {
  const store = useStoreContext()
  const [router, RouterContext] = createRouteProvider(props.history)
  const [navi, NaviContext] = createNaviProvider()
  const [MusicPlayer] = createMusicPlayerProvider()
  const [Debug] = createDebugProvider()
  const [Speaker] = createSpeakerProvider()
  const local = useLocalStore(() => ({
    views: [],
    layers: [],
    menus: {
      Home: <HomePage />,
      Mine: <MinePage />
    },
    getCacheMenu(view) {
      if (!local.menus[view]) {
        const Comp = local.layers[view]
        local.menus[view] = <Comp />
      }
      return local.menus[view] || local.menus.home
    },
  }))

  const { pathname, search } = props.location
  useEffectOnce(() => {
    pages.forEach(page => {
      if (page.view) {
        local.layers[page.view] = page.component
      }
    })
    // 默认是home
    const name = props.location.pathname.split('/').pop()
    if (store.app.selectedMenu !== name) {
      store.app.setMenu(name)
    }
    const query = getQuery(search.substr(1));
    if (query.home && query.home.tab) {
      store.app.setTab(query.home.tab)
    }
  })
  local.views = pathname.startsWith('/root/') ? pathname2views(pathname + search) : [];
  return <RouterContext.Provider value={router}>
    <NaviContext.Provider value={navi}>
      <Observer>{
        () => {
          if (!store.app.isLogin && props.location.pathname.startsWith('/root')) {
            return <Redirect to={'/auth/login'}></Redirect>
          } else if (store.app.isLogin) {
            if (store.app.config.isLockerOpen && store.app.config.isLockerLocked) {
              return <LockerView />
            }
          }
          if (store.app.config.isLockerOpen && store.app.config.isLockerLocked) {
            return <LockerView />
          }
          return <Fragment>
            <MusicPlayer />
            <Debug />
            <Speaker />
            <Switch>
              <Route path="/auth/login" component={AuthLoginPage} />
              <Route path="/root/*" component={() => (
                <Layout>
                  {store.app.selectedMenu === 'home' ? local.menus.Home : local.menus.Mine}
                </Layout>
              )} />
              <Route component={NoMatch}></Route>
            </Switch>
            <AppRoot views={local.views} layers={local.layers} />
          </Fragment>
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
    {/* <Route path="/auth/login" component={() => <AuthLoginPage />}></Route> */}
    <Route path={'/*'} component={App}></Route>
  </BrowserRouter>
}