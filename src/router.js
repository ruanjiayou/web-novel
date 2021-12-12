import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import React, { Fragment, useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useStoreContext, createRouteProvider, createNaviProvider, createMusicPlayerProvider, createDebugProvider, createSpeakerProvider } from 'contexts'
import { LockerView, Splash } from 'components'
import Layout from './layout'
import { useEffectOnce } from 'react-use'
import { views } from 'pages'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// 路由=>组件.没登录跳到登录.登录了匹配novel.匹配失败就重定向route.

function App(props) {
  const store = useStoreContext()
  const [router, RouterContext] = createRouteProvider(props.history)
  const [navi, NaviContext] = createNaviProvider()
  const [MusicPlayer] = createMusicPlayerProvider()
  const [Debug] = createDebugProvider()
  const [Speaker] = createSpeakerProvider()
  const local = useLocalStore(() => ({
    showSpflash: true,
    remainSeconds: 5,
    layers: [],
    action: 'enter'
  }));
  useEffect(() => {
    local.layers = router.bootstrap(router.history.location);
    const name = (props.location.pathname.split('/')[2]).split('?')[0]
    if (!store.app.selectedMenu) {
      store.app.setMenu('home')
    } else if (store.app.selectedMenu !== name) {
      store.app.setMenu(name)
    }
    if (store.app.selectedMenu === 'home') {
      store.app.setBarBGC('#108ee9')
    }
    if (store.app.selectedMenu === 'groups') {
      store.app.setBarBGC('rgb(150 159 169)')
    }
    if (store.app.selectedMenu === 'awhile') {
      store.app.setBarBGC('black')
    }
    if (store.app.selectedMenu === 'music') {
      store.app.setBarBGC('plum')
    }
    if (store.app.selectedMenu === 'mine') {
      store.app.setBarBGC('rgb(249, 122, 144)')
    }
    // 沉浸式
    store.app.setShowBar(store.app.selectedMenu !== 'awhile')
    store.app.setHideMenu(store.app.selectedMenu === 'awhile')
  }, [router.history.location.pathname])

  const Page = router.getPage()
  return <RouterContext.Provider value={router}>
    <NaviContext.Provider value={navi}>
      <Observer>{
        () => {
          if (!Page) {
            return <Redirect to={'/novel/home'}></Redirect>
          }
          if (!store.app.isLogin && props.location.pathname.startsWith('/novel') && store.app.forceLogin) {
            return <Redirect to={'/novel/auth/login'}></Redirect>
          } else if (store.app.config.isLockerOpen && store.app.config.isLockerLocked) {
            return <LockerView />
          }
          return <Fragment>
            <MusicPlayer />
            <Debug />
            <Speaker />
            <Layout>
              <Page />
            </Layout>
            <TransitionGroup component={null}>
              {local.layers.map((layer, i) => {
                const Comp = router.getPage(layer.view)
                return <CSSTransition
                  key={i}
                  timeout={{ enter: !router.userEvent ? 0 : 300, exit: !router.userEvent ? 0 : 300 }}
                  unmountOnExit={!router.userEvent}
                  className={router.userEvent ? 'layer-item' : local.action === 'enter' ? 'exit-now' : 'enter-now'}
                  onEnter={(node) => {
                    local.action = 'enter'
                    router.userEvent = true
                  }}
                  onExit={() => {
                    router.userEvent = true
                    local.action = 'exit'
                  }}

                  onEntered={() => {
                    router.userEvent = false
                  }}
                  onExited={() => {
                    router.userEvent = false
                  }}
                >
                  <div key={i} className="page" style={{ width: '100%', height: '100%', position: 'absolute', zIndex: i + 101, backgroundColor: '#ffffff' }}>
                    <Comp params={layer.params} />
                  </div>
                </CSSTransition>
              })}
            </TransitionGroup>
            {/* <Splash remainSeconds={1} can={true} booting={store.app.booting}></Splash> */}
          </Fragment>
        }
      }</Observer>
    </NaviContext.Provider>
  </RouterContext.Provider>
}

function AuthLogin(props) {
  const [router, RouterContext] = createRouteProvider(props.history)
  const [navi, NaviContext] = createNaviProvider()
  const View = views.get('login');
  return <RouterContext.Provider value={router}>
    <NaviContext.Provider value={navi}>
      <View />
    </NaviContext.Provider>
  </RouterContext.Provider>
}
function NoMatch() {
  const store = useStoreContext()
  if (store.app.isLogin || !store.app.forceLogin) {
    return <Redirect to={'/novel/home'}></Redirect>
  } else {
    return <Redirect to={'/novel/auth/login'}></Redirect>
  }
}

export default function Index() {
  return <BrowserRouter basename={'/'}>
    <Switch>
      <Route path={'/novel/auth/login'} component={AuthLogin} />
      <Route path={'/novel/*'} component={App}></Route>
      <Route component={NoMatch} />
    </Switch>
  </BrowserRouter>
}