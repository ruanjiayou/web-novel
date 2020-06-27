import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import React, { Fragment, useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useStoreContext, createRouteProvider, createNaviProvider, createMusicPlayerProvider, createDebugProvider, createSpeakerProvider } from 'contexts'
import { LockerView } from 'components'
import Layout from '../layout'
import { useEffectOnce } from 'react-use'
import { views } from 'pages'

// 路由=>组件.没登录跳到登录.登录了匹配root.匹配失败就重定向route.

function LayerView({ router }) {
  return <Fragment>
    {
      router.layers.map((layer, i) => {
        const Comp = router.getPage(layer.view)
        if (i === 0) {
          return null;
        }
        if (Comp) {
          return <div key={i} style={{ width: '100%', height: '100%', position: 'absolute', zIndex: i + 99, backgroundColor: '#ffffff' }}>
            <Comp params={layer.params} />
          </div>
        } else {
          return <div style={{ width: '100%', height: '100%', position: 'absolute', zIndex: i + 99, backgroundColor: '#ffffff' }} key={i}>empty: {layer.view} params:{JSON.stringify(layer.params)}</div>
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
  useEffectOnce(() => {
    // 默认是home
    const name = props.location.pathname.split('/').pop()
    if (store.app.selectedMenu !== name) {
      store.app.setMenu(name)
    }
    const query = router.getQuery();
    if (query.home && query.home.tab) {
      store.app.setTab(query.home.tab)
    }
    // FIXME: router第一次的表现特殊
    router.boot(props.location)
  })
  const Page = router.getPage()
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
            <Layout>
              <Page />
            </Layout>
            <LayerView router={router} />
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
    <Switch>
      <Route path={'/root/**'} component={App}></Route>
      <Route path={'/auth/login'} component={views.get('Login')} />
      <Route component={NoMatch} />
    </Switch>
  </BrowserRouter>
}