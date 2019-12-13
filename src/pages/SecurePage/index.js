import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { Switch } from 'antd-mobile'
import globalStore from 'global-state'
import { useRouterContext } from 'contexts/router'
import { useNaviContext } from 'contexts/navi'

export default function SecurePage() {
  const router = useRouterContext()
  const Navi = useNaviContext()
  return <Observer>{() => (
    <Fragment>
      <Navi title="安全" router={router} />
      <div className="full-height">
        <div className="dd-common-alignside" style={{ padding: '15px 20px', backgroundColor: 'white' }}>
          密码锁
        <Switch checked={globalStore.app.config.isLockerOpen} onChange={checked => globalStore.app.setLocker(checked)} />
        </div>
        <div className="dd-common-alignside" style={{ padding: '15px 20px', backgroundColor: 'white' }}>
          调试
        <Switch checked={globalStore.app.showDebug} onChange={checked => globalStore.app.toggleDebug()} />
        </div>
        <div className="dd-common-alignside" style={{ padding: '15px 20px', backgroundColor: 'white' }}>
          语音
        <Switch checked={globalStore.app.showSpeaker} onChange={checked => globalStore.app.toggleSpeaker()} />
        </div>
        <div className="dd-common-alignside" style={{ padding: '15px 20px', backgroundColor: 'white' }}>
          音乐
        <Switch checked={globalStore.app.showMusic} onChange={checked => globalStore.app.toggleMusic()} />
        </div>
      </div>
    </Fragment>
  )}</Observer>
}