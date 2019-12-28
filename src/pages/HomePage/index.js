import React from 'react'
import { Observer } from 'mobx-react-lite'
import { Tabs } from 'antd-mobile'
import { useStoreContext, useRouterContext } from 'contexts'
import { RenderGroups } from 'group'
import { useEffectOnce } from 'react-use'

export default ({ self, children }) => {
  const router = useRouterContext()
  const store = useStoreContext()
  const channels = store.app.channels
  const loaders = store.channelsLoader
  useEffectOnce(() => {
    let loader = loaders[channels[0].name]
    if (loader && loader.isEmpty) {
      loader.refresh({ params: { name: channels[0].name } })
    }
  })
  return <Observer>
    {() => (
      <div className="full-height">
        <Tabs tabs={store.app.channels} onChange={(tab, index) => {
          let loader = loaders[channels[index].name]
          if (loader.isEmpty) {
            loader.refresh({ params: { name: channels[index].name } })
          }
        }}>{
            store.app.channels.map((channel, index) => (
              <RenderGroups key={index} loader={loaders[channel.name]} />
            ))
          }</Tabs>
      </div>
    )}
  </Observer>

}