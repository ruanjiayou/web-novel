import React from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { InputItem, List, Button, Toast, Modal } from 'antd-mobile'

import { MIconView } from 'components'
import services from 'services'
import UserLoader from 'loader/UserLoader'
import createPageModel from 'page-group-loader-model/BasePageModel'
import { useRouterContext, useStoreContext, useNaviContext } from 'contexts'

const model = createPageModel({ UserLoader });

async function login({ router, local, store, services }) {
  if (local.account && local.password) {
    local.isLoading = true
    let res = await services.login({ data: local })
    local.isLoading = false
    if (!res || !res.data) {
      return Toast.info('请求失败!')
    }
    if (res.code !== 0) {
      return Toast.info(res.message)
    } else {
      store.app.setAccessToken(res.data.token)
      store.app.setRefreshToken(res.data.refresh_token)
      router.history.push({
        pathname: '/'
      })
    }
  } else {
    Toast.info('请输入账号密码!')
  }
}

// eslint-disable-next-line
async function register({ router, local, services }) {
  if (local.account && local.password) {
    local.isLoading = true
    let res = await services.register(local)
    local.isLoading = false
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

function View() {
  // FIXME: 注意此时没有提供context
  const router = useRouterContext();
  const store = useStoreContext();
  const Navi = useNaviContext();
  let local = useLocalStore(() => ({
    isLoading: false,
    isLogin: false,
    isRegister: false,
    account: '',
    password: ''
  }))
  return <Observer>
    {() => (
      <div className="full-height">
        <Navi title="账号登录" router={router} />
        <div className="full-height-auto">
          <div className="dd-common-centerXY" style={{ position: 'relative' }}>
            {/* <div style={{ position: 'absolute', right: 0, top: 0, padding: 5 }}>
              <MIconView type="FaCog" onClick={() => {
                Modal.prompt('地址', '', [
                  { text: '取消' },
                  {
                    text: '确定', onPress: val => {
                      store.app.setBaseURL(val)
                    }
                  }
                ], 'default', store.app.baseURL)
              }} />
            </div> */}
            <List>
              <List.Item>
                <InputItem
                  type="text"
                  placeholder="用户名"
                  style={{ border: '0 none' }}
                  defaultValue={local.account}
                  onBlur={value => local.account = value}
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
                  onChange={value => local.password = value}
                  onKeyUpCapture={e => {
                    if (e.keyCode === 13) {
                      login({ router, local, store, services })
                    }
                  }}
                >
                  密码
            </InputItem>
              </List.Item>
              <List.Item style={{ display: 'flex' }}>
                <Button loading={local.isLogin} disabled={local.isLogin || local.isRegister} type="primary" onClick={() => login({ router, local, store, services })}>登录</Button>
              </List.Item>
            </List>
          </div>
        </div>
      </div>
    )}
  </Observer>
}

export default {
  group: {
    view: 'login',
    attrs: {},
  },
  model,
  View,
}