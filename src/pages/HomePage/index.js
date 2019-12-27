import React from 'react'
import { Observer } from 'mobx-react-lite'
import { Tabs } from 'antd-mobile'
import { useStoreContext } from 'contexts'
import { RenderGroups } from 'group'
import { useEffectOnce } from 'react-use'

export default ({ self, children }) => {
  const store = useStoreContext()
  const channels = store.app.channels
  const loaders = store.channelsLoader
  useEffectOnce(() => {
    let loader = loaders[0]
    if (loader && loader.isEmpty) {
      loader.refresh({ params: { group_id: channels[0].group_id } })
    }
  })
  return <Observer>
    {() => (
      <div className="full-height">
        <Tabs tabs={store.app.channels} onChange={(tab, index) => {
          let loader = loaders[index]
          if (loader.isEmpty) {
            loader.refresh({ params: { group_id: channels[index].group_id } })
          }
        }}>{
            store.app.channels.map((channel, index) => (
              <RenderGroups key={index} loader={loaders[index]} />
            ))
          }</Tabs>
      </div>
    )}
  </Observer>

}