import React, { useEffect } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Tabs } from 'antd-mobile'

import { RenderGroups } from 'group'
import { MIconView } from 'components'
import { FullHeight, FullWidth, FullHeightAuto, } from 'components/common'
import { channelLoaders } from 'global-state'
import createPageModel from 'page-group-loader-model/BasePageModel'

const model = createPageModel({})

function View({ self, router, store, params }) {
  const channels = store.app.channels
  const loaders = channelLoaders
  useEffectOnce(() => {
    if (params.tab) {
      store.app.setTab(params.tab)
    }
    if (!store.app.tab) {
      store.app.setTab(channels.length ? channels[0].group_id : '')
    }
  })
  return <Observer>
    {() => (
      <FullHeight>
        <FullWidth style={{ height: 50 }}>
          <img src="/logo.jpg" alt="" style={{ margin: '0 10px', borderRadius: '50%' }} />
          <FullHeightAuto style={{ height: 25, backgroundColor: '#ccc', borderRadius: 5, }} />
          <div style={{ color: '#f97a90', margin: '0 10px' }} onClick={() => { router.pushView('Marked') }}>
            <MIconView type="FaStar" />
          </div>
        </FullWidth>
        <Tabs
          initialPage={channels.findIndex(channel => channel.group_id === store.app.tab)}
          tabs={channels}
          distanceToChangeTab={0.5}
          onChange={(tab, index) => {
            store.app.setTab(tab.group_id)
            router.replaceView('home', { tab: tab.group_id })
          }}>{
            channels.map((channel, index) => (
              <RenderGroups key={index} loader={loaders[channel.group_id]} group={channel.data} />
            ))
          }</Tabs>
      </FullHeight>
    )}
  </Observer>
}

export default {
  group: {
    view: 'home',
  },
  model,
  View,
}