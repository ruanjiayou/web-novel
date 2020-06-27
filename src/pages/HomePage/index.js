import React, { useEffect } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Tabs } from 'antd-mobile'
import { useStoreContext, useRouterContext } from 'contexts'
import { RenderGroups } from 'group'
import { channelLoaders } from 'global-state'
import createPageModel from 'page-group-loader-model/BasePageModel'

const ViewModel = createPageModel({})

function Component({ self }) {
  const router = useRouterContext()
  const store = useStoreContext()
  const channels = store.app.channels
  const loaders = channelLoaders
  useEffectOnce(() => {
    if (!store.app.tab) {
      store.app.setTab(channels.length ? channels[0].group_id : '')
    }
  })
  return <Observer>
    {() => (
      <div className="full-height">
        <Tabs initialPage={channels.findIndex(channel => channel.group_id === store.app.tab)} tabs={channels} onChange={(tab, index) => {
          store.app.setTab(tab.group_id)
          router.replaceView('home', { tab: tab.group_id })
        }}>{
            channels.map((channel, index) => (
              <RenderGroups key={index} loader={loaders[channel.group_id]} group={channel.data} />
            ))
          }</Tabs>
      </div>
    )}
  </Observer>
}

export default {
  config: {
    view: 'home',
    attrs: {},
  },
  Component,
  ViewModel,
}