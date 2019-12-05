import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { Switch } from 'antd-mobile'
import globalStore from 'global-state'
import { useProvider } from 'contexts/router'
import { useNaviContext } from 'contexts/navi'

export default function SecurePage() {
  const router = useProvider()
  const Navi = useNaviContext()
  return <Observer>{() => (
    <Fragment>
      <Navi title="安全" router={router} />
      <div className="full-height">
        <div className="dd-common-alignside" style={{ padding: '15px 20px', backgroundColor: 'white' }}>
          密码锁
        <Switch checked={globalStore.app.config.isLockerOpen} onChange={checked => globalStore.app.setLocker(checked)} />
        </div>
      </div>
    </Fragment>
  )}</Observer>
}