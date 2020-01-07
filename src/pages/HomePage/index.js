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
  const subLoaders = store.resourceListLoaders
  const query = router.getQuery()
  useEffect(() => {
    let loader = loaders[query.tab]
    let subLoader = subLoaders[query.tab]
    store.app.setTab(query.tab)
    if (!query.tab) {
      query.tab = channels.length ? channels[0].name : ''
      router.replaceView('/root/home', query)
    } else if (loader && loader.canStart) {
      loader.refresh({ params: { name: query.tab } }).then(res => {
        const query = loader.getQuery()
        if (subLoader.canStart) {
          subLoader.refresh({ query })
        }
      })
    }
  })
  return <Observer>
    {() => (
      <div className="full-height">
        <Tabs initialPage={channels.findIndex(channel => channel.name === query.tab)} tabs={channels} onChange={(tab, index) => {
          query.tab = tab.name
          store.app.setTab(query.tab)
          router.replaceView('/root/home', query)
        }}>{
            channels.map((channel, index) => (
              <RenderGroups key={index} loader={loaders[channel.name]} subLoader={subLoaders[channel.name]} />
            ))
          }</Tabs>
      </div>
    )}
  </Observer>

}