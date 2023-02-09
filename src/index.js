// import App from './app';
import React, { Fragment, useEffect, useCallback } from 'react'
import Helmet from 'react-helmet'
import ReactDOM from 'react-dom'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ActivityIndicator, Button } from 'antd-mobile'
import RouterRoot from './router'
import globalStore from './store'
import { isPWAorMobile } from './utils/utils'
import { createStoreProvider } from 'contexts'
import { AutoCenterView, UserAreaView, Splash } from 'components'
import './components/common.css'
import './group/group.css'
import 'antd-mobile/dist/antd-mobile.css'
// import './transition.css'
// https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/src/serviceWorker.js
import * as swManager from './sw-manager'
import services from 'services'
import config from 'config'
import { useEffectOnce } from 'react-use'

// 引入router.顺便做点什么: loading/emptyView什么的
function App() {
  const [store, StoreContext] = createStoreProvider(globalStore)
  const local = useLocalStore(() => ({
    isError: false
  }))
  const launch = useCallback(() => {
    store.app.setBoot(true)
    store.app.setHistoryLength(window.history.length)
    services.getBoot().then(res => {
      if (res.code !== 0) {
        throw res.message
      } else {
        store.ready(res.data)
      }
    }).catch(e => {
      store.app.setBoot(false)
      local.isError = true
      console.log(e, 'boot')
      throw '启动失败'
    })
  })
  useEffect(() => {

  })
  useEffectOnce(() => {
    launch();
    window.addEventListener('online', () => {
      if (local.isError) {
        local.isError = false;
        launch();
      }
    })
  })
  return <Observer>
    {() => {
      if (store.app.booting) {
        return <Splash />
      } else if (local.isError) {
        return <AutoCenterView>
          <Button style={{ width: 150 }} type="primary" onClick={() => {
            launch()
            local.isError = false
          }}>{navigator.onLine ? '点击重试' : '您处于离线状态'}</Button>
        </AutoCenterView>
      } else {
        return (
          <StoreContext.Provider value={store}>
            <UserAreaView bar={store.app.showBar}>
              <RouterRoot></RouterRoot>
            </UserAreaView>
          </StoreContext.Provider>
        )
      }
    }
    }
  </Observer>
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      info: null,
      isLoading: false,
      lastTS: Date.now(),
      isPWAorMobile: isPWAorMobile()
    }
  }

  componentDidCatch(error, info) {
    console.log(error)
    console.log(info)
    this.setState({ hasError: true, error, info })
  }

  componentDidMount() {
    document.getElementById('start-loading').style.display = 'none'
    // document.getElementById('box').className = this.state.isPWAorMobile ? 'box-app' : 'box-browser'
    document.getElementById('box').className = 'box-app'
    document.addEventListener('visibilitychange', async (e) => {
      // TODO: 时间过长处理.刷新
      if (document.hidden) {
        globalStore.app.resetLeaveTS()
      } else if (globalStore.app.config.isLockerOpen === false) {
        globalStore.app.setLocked(Date.now() - globalStore.app.leaveTS > globalStore.app.config.lockerSeconds)
      }
    })
  }

  render() {
    if (this.state.hasError) {
      // window.localStorage.clear()
      return <Fragment>
        <AutoCenterView>
          程序崩溃了,<div onClick={() => {
            this.setState({ isLoading: true }, async () => {
              // TODO: 域名检测 const result = await checkHost();
              this.setState({ isLoading: false })
              this.setState({ hasError: false }, () => {
                window.location.reload()
              })
            })
          }}>点我重试</div>
        </AutoCenterView>
        <ActivityIndicator
          toast
          text="正在刷新..."
          animating={this.state.isLoading}
        />
      </Fragment>
    } else {
      return <Fragment>
        {this.props.children}
        <ActivityIndicator
          toast
          text="正在刷新..."
          animating={this.state.isLoading}
        />
      </Fragment>
    }
    // PC网页运行直接显示~~
    // } else if (this.state.isPWAorMobile) {
    // else {
    //   return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>程序正在开发中...</div>
    // }
  }
}

function Simulator() {
  return <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 450, height: 720 }}>
    <iframe src={window.location.href} style={{ height: '100%', width: '100%' }} frameBorder="none"></iframe>
  </div>
}
// 总入口: 将组件挂载到dom上
ReactDOM.render(<ErrorBoundary>
  <Helmet title={'学习测试'} />
  <App />
</ErrorBoundary>, document.getElementById('root'))

// serviceWorker.unregister();
if (window.parent === window) {
  serviceWorker.register()
}
