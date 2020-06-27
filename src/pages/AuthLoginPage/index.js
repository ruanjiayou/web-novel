import React from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { InputItem, List, Button, Toast, Modal } from 'antd-mobile'

import { MIconView } from 'components'
import { useRouterContext, useNaviContext, useStoreContext } from 'contexts'
import services from 'services'

async function login(router, store, globalStore) {
  if (store.account && store.password) {
    store.isLoading = true
    let res = await services.login({ data: store })
    store.isLoading = false
    if (!res || !res.data) {
      return Toast.info('请求失败!')
    }
    if (res.code !== 0) {
      return Toast.info(res.message)
    } else {
      globalStore.app.setAccessToken(res.data.token)
      globalStore.app.setRefreshToken(res.data.refresh_token)
      router.history.push({
        pathname: '/'
      })
    }
  } else {
    Toast.info('请输入账号密码!')
  }
}

// eslint-disable-next-line
async function register(router, store) {
  if (store.account && store.password) {
    store.isLoading = true
    let res = await services.register(store)
    store.isLoading = false
    if (!res) {
      return Toast.info('请求失败!')
    }
    if (res.code !== 0) {
      return Toast.info(res.message)
    } else {
      Toast.info('注册成功!')
    }
  } else {
    Toast.info('请输入账号密码!')
  }
}

export default function ({ self }) {
  const globalStore = useStoreContext()
  let Navi = useNaviContext()
  let router = useRouterContext()
  let store = useLocalStore(() => ({
    isLoading: false,
    isLogin: false,
    isRegister: false,
    account: '',
    password: ''
  }))
  return <Observer>
    {() => (
      <div className="full-height">
        <Navi left={<span style={{ whiteSpace: 'nowrap' }}>返回</span>} title="账号登录" router={router} />
        <div className="full-height-auto">
          <div className="dd-common-centerXY" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', right: 0, top: 0, padding: 5 }}>
              <MIconView type="FaCog" onClick={() => {
                Modal.prompt('地址', '', [
                  { text: '取消' },
                  {
                    text: '确定', onPress: val => {
                      globalStore.app.setBaseURL(val)
                    }
                  }
                ], 'default', globalStore.app.baseURL)
              }} />
            </div>
            <List>
              <List.Item>
                <InputItem
                  type="text"
                  placeholder="用户名"
                  style={{ border: '0 none' }}
                  defaultValue={store.account}
                  onBlur={value => store.account = value}
                >
                  用户名
            </InputItem>
              </List.Item>
              <List.Item>
                <InputItem
                  type="password"
                  placeholder="密码"
                  defaultValue=""
                  style={{ border: '0 none' }}
                  onBlur={value => store.password = value}
                >
                  密码
            </InputItem>
              </List.Item>
              <List.Item style={{ display: 'flex' }}>
                <Button loading={store.isLogin} disabled={store.isLogin || store.isRegister} type="primary" onClick={() => login(router, store, globalStore)}>登录</Button>
                
              </List.Item>
            </List>
          </div>
        </div>
      </div>
    )}
  </Observer>
}