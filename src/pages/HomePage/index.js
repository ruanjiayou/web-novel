import React, { useEffect } from 'react'
import { Observer } from 'mobx-react-lite'
import { Tabs } from 'antd-mobile'
import { useStoreContext, useRouterContext } from 'contexts'
import { RenderGroups } from 'group'

export default ({ self, children }) => {
  const router = useRouterContext()
  const store = useStoreContext()
  const channels = store.app.channels
  const loaders = store.channelLoaders
  const query = router.getQuery()
  useEffect(() => {
    store.app.setTab(query.tab)
    if (!query.tab) {
      query.tab = channels.length ? channels[0].group_id : ''
      router.replaceView('/root/home', query)
    }
  })
  return <Observer>
    {() => (
      <div className="full-height">
        <Tabs initialPage={channels.findIndex(channel => channel.group_id === query.tab)} tabs={channels} onChange={(tab, index) => {
          query.tab = tab.group_id
          store.app.setTab(query.tab)
          router.replaceView('/root/home', query)
        }}>{
            channels.map((channel, index) => (
              <RenderGroups key={index} loader={loaders[channel.group_id]} group={channel.data} />
            ))
          }</Tabs>
      </div>
    )}
  </Observer>

}