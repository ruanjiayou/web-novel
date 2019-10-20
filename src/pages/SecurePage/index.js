import React, { useEffect } from 'react'
import { Observer } from 'mobx-react-lite'
import { Switch } from 'antd-mobile'
import globalStore from 'global-state'

export default function SecurePage() {
  return <Observer>{() => (
    <div className="full-height">
      <div className="dd-common-alignside" style={{ padding: '15px 20px', backgroundColor: 'white' }}>
        密码锁
        <Switch checked={globalStore.app.config.isLockerOpen} onChange={checked => globalStore.app.setLocker(checked)} />
      </div>
    </div>
  )}</Observer>
}