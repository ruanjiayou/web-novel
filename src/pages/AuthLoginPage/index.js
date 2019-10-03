import React from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useRouterContext } from 'contexts/router'
import { InputItem, List, Button, Toast, Modal } from 'antd-mobile'

import services from 'services'
import globalStore from 'global-state'
import MIconView from 'components/MIconView'

import './index.css'

async function login(router, store) {
  if (store.account && store.password) {
    store.isLoading = true
    let res = await services.login(store)
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

export default function ({ self }) {
  let router = useRouterContext()
  let store = useLocalStore(() => ({
    isLoading: false,
    account: '',
    password: ''
  }))
  return <Observer>
    {() => {
      return <div className="dd-common-centerXY" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', right: 0, top: 0, padding: 5 }}>
          <MIconView type="FaCog" onClick={() => {
            Modal.prompt('地址', '', [
              { text: '取消' },
              { text: '确定', onPress: val => {
                globalStore.app.setBaseURL(val)
              } }
            ], 'default', '')
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
          <List.Item>
            <Button loading={store.isLoading} disabled={store.isLoading} type="primary" onClick={() => login(router, store)}>登录</Button>
          </List.Item>
        </List>
      </div>
    }}
  </Observer>
}