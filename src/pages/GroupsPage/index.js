import React from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useRouterContext, useStoreContext } from 'contexts'
import { useEffectOnce } from 'react-use'
import renderEmptyView from '../../components/EmptyView'
import AutoCenterView from '../../components/AutoCenterView'

export default function GroupsPage() {
  const router = useRouterContext()
  const gStore = useStoreContext()
  useEffectOnce(() => {
    if (gStore.groupListLoader.isEmpty) {
      gStore.groupListLoader.refresh()
    }
  })
  return <Observer>{() => (
    <div className="full-height">
      <div style={{ padding: 10 }}>所有频道</div>
      <div className="full-height-auto">{
        gStore.groupListLoader.isEmpty ? <AutoCenterView>{renderEmptyView(gStore.groupListLoader)}</AutoCenterView> : (
          gStore.groupListLoader.items.map(group => <div style={{ width: '33%', float: 'left', textAlign: 'center', lineHeight: '30px' }} key={group.id} onClick={() => {
            router.pushView(`/root/group-tree/${group.name}`, null, { title: group.title })
          }}>{group.title}</div>)
        )
      }</div>
    </div>
  )}</Observer>
}