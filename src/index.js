// import App from './app';
import React, { Fragment, useEffect } from 'react'
import Helmet from 'react-helmet'
import ReactDOM from 'react-dom'
import { Observer } from 'mobx-react-lite'
import { ActivityIndicator } from 'antd-mobile'
import RouterRoot from './router'
import globalStore from './global-state'
import { isPWAorMobile } from './utils/utils'
import { createStoreProvider } from 'contexts'
import GroupTreeLoader from 'loader/GroupTreeLoader'
import ResourceListLoader from 'loader/ResourceListLoader'
import './components/common.css'
import './group/group.css'
import 'antd-mobile/dist/antd-mobile.css'
// https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/src/serviceWorker.js
import * as serviceWorker from './service-worker'
import services from 'services'
import config from 'config'

// 引入router.顺便做点什么: loading/emptyView什么的
function App() {
  const [store, StoreContext] = createStoreProvider(globalStore)
  useEffect(() => {
    services.getBoot().then(res => {
      if (res.code !== 0) {
        throw res.message
      } else {
        store.userLoader.setData(res.data.user)
        store.lineLoader.setData(res.data.lines)
        store.app.setTabs(res.data.tabs)
        store.app.setChannels(res.data.channels)
        res.data.channels.forEach(channel => {
          store.channelLoaders[channel.group_id] = GroupTreeLoader.create()
          store.resourceListLoaders[channel.group_id] = ResourceListLoader.create()
        })
        store.app.booted()
      }
    }).catch(e => {
      console.log(e, 'boot')
      throw '启动失败'
    })
  })
  return <Observer>
    {() => {
      if (store.app.booting) {
        return <div className="dd-common-centerXY">启动中...</div>
      } else {
        return (
          <Fragment>
            <StoreContext.Provider value={store}>
              <RouterRoot></RouterRoot>
            </StoreContext.Provider>
          </Fragment>
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
      } else if (globalStore.app.config.isLockerLocked === false) {
        globalStore.app.setLocked(Date.now() - globalStore.app.leaveTS > globalStore.app.config.lockerSeconds)
      }
    })
  }

  render() {
    if (this.state.hasError) {
      return <Fragment>
        <div>程序崩溃了,<div onClick={() => {
          this.setState({ isLoading: true }, async () => {
            // TODO: 防封处理 const result = await checkHost();
            this.setState({ isLoading: false })
            this.setState({ hasError: false }, () => {
              window.location.reload()
            })
          })
        }}>点我重试</div></div>
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

// 总入口: 将组件挂载到dom上
ReactDOM.render(<ErrorBoundary>
  <Helmet title={'demo-' + config.VERSION} />
  <App />
</ErrorBoundary>, document.getElementById('root'))

// serviceWorker.unregister();
serviceWorker.register()