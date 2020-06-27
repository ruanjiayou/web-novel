import React from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useRouterContext, useStoreContext } from 'contexts'
import { useEffectOnce } from 'react-use'
import renderEmptyView from '../../components/EmptyView'
import AutoCenterView from '../../components/AutoCenterView'
import createPageModel from 'page-group-loader-model/BasePageModel'
import loaders from 'loader'

export const ViewModel = createPageModel({
  GroupListLoader: loaders.GroupListLoader
})

export default function GroupsPage({ self }) {
  const router = useRouterContext()
  const gStore = useStoreContext()
  useEffectOnce(() => {
    if (self.GroupListLoader.isEmpty) {
      self.GroupListLoader.refresh()
    }
  })
  return <Observer>{() => (
    <div className="full-height">
      <div style={{ padding: 10 }}>所有频道</div>
      <div className="full-height-auto">{
        self.GroupListLoader.isEmpty ? <AutoCenterView>{renderEmptyView(self.GroupListLoader)}</AutoCenterView> : (
          self.GroupListLoader.items.map(group => <div style={{ width: '33%', float: 'left', textAlign: 'center', lineHeight: '30px' }} key={group.id} onClick={() => {
            router.pushView(`group-tree`, { name: group.name })
          }}>{group.title}</div>)
        )
      }</div>
    </div>
  )}</Observer>
}