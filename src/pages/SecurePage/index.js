import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { Switch } from 'antd-mobile'

import createPageModel from 'page-group-loader-model/BasePageModel'

const model = createPageModel({});

function View({ self, router, store, Navi, }) {
  return <Observer>{() => (
    <Fragment>
      <Navi title="安全" router={router} />
      <div className="full-height">
        <div className="dd-common-alignside" style={{ padding: '15px 20px', backgroundColor: 'white' }}>
          密码锁
        <Switch checked={store.app.config.isLockerOpen} onChange={checked => store.app.setLocker(checked)} />
        </div>
        <div className="dd-common-alignside" style={{ padding: '15px 20px', backgroundColor: 'white' }}>
          调试
        <Switch checked={store.app.showDebug} onChange={checked => store.app.toggleDebug()} />
        </div>
        <div className="dd-common-alignside" style={{ padding: '15px 20px', backgroundColor: 'white' }}>
          语音
        <Switch checked={store.app.showSpeaker} onChange={checked => store.app.toggleSpeaker()} />
        </div>
        <div className="dd-common-alignside" style={{ padding: '15px 20px', backgroundColor: 'white' }}>
          音乐
        <Switch checked={store.app.showMusic} onChange={checked => store.app.toggleMusic()} />
        </div>
      </div>
    </Fragment>
  )}</Observer>
}

export default {
  group: {
    view: 'UserSecure',
  },
  model,
  View,
}