import React from 'react'
import { useEffectOnce } from 'react-use'
import { Observer } from 'mobx-react-lite'
import { useRouterContext } from 'contexts/router'
import GroupListLoader from 'loader/GroupListLoader'
import LoaderListView from 'components/LoaderListView'
import GroupItemView from 'business/GroupItemView'

export default function GroupTreePage() {
  const loader = GroupListLoader.create()
  const router = useRouterContext()
  useEffectOnce(() => {
    if (loader.isEmpty) {
      loader.refresh()
    }
  })
  return <Observer>{() => (
    <div style={{ flex: 1, height: '100%' }}>
      <LoaderListView
        loader={loader}
        renderItem={(item, selectionId, index) => (
          <GroupItemView item={item} selectionId={selectionId} router={router} />
        )}
      />
    </div>
  )}</Observer>
}