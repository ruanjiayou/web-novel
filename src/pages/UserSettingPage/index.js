import React, { useEffect } from 'react'
import { Observer } from 'mobx-react-lite'
import { List, Button } from 'antd-mobile'

import MIconView from 'components/MIconView'
import createPageModel from 'page-group-loader-model/BasePageModel'

const model = createPageModel({});

function View({ self, router, store, Navi }) {
  return <Observer>{
    () => {
      return <div className="full-height">

        <Navi title="设置" router={router} />
        <div>
          <List renderHeader={() => '设置'}>
            <List.Item>
              <div className="dd-common-alignside">
                <span>账号设置</span>
                <MIconView type="FaAngleRight" />
              </div>
            </List.Item>
          </List>
          <div style={{ padding: 10 }}>
            <Button type="primary" onClick={() => { store.app.setAccessToken(''); router.pushView('/auth/login') }}>退出</Button>
          </div>
        </div>
      </div>
    }
  }</Observer >
}

export default {
  group: {
    view: 'UserSetting',
  },
  View,
  model,
}