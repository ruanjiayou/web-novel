import React, { useEffect, useCallback } from 'react'
import { useMount } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import FilterRow from '../FitlerRow'
import { LoaderListView } from 'components'
import ResourceItem from 'business/ResourceItem'
import { useStoreContext } from 'contexts'
import ResourceListLoader from 'loader/ResourceListLoader'

export default function Filter({ self, loader, ...props }) {
  const store = useStoreContext()
  const lstore = useLocalStore(() => ({
    loader: store.resourceListLoaders[loader.item.id] || ResourceListLoader.create()
  }))
  const refresh = useCallback(() => {
    const query = loader.getQuery()
    lstore.loader.refresh({ query })
  })
  useMount(mount => {
    mount && mount()
    if (!store.resourceListLoaders[loader.item.id]) {
      store.resourceListLoaders[loader.item.id] = lstore.loader
    }
    if (lstore.loader.state === 'init') {
      refresh()
    }
  }, [])
  return <Observer>{() => (
    <div className="full-height">
      <div onTouchStart={e => {
        e.stopPropagation()
        e.preventDefault()
      }}>{self.children.map(child => (<FilterRow self={child} key={child.id} onQueryChange={refresh} />))}</div>
      <div className="full-height-auto">
        <LoaderListView
          loader={lstore.loader}
          loadMore={() => {
            const query = loader.getQuery()
            lstore.loader.loadMore({ query })
          }}
          refresh={refresh}
          renderItem={(item, selectionId, index) => <ResourceItem
            key={index}
            item={item}
            loader={lstore.loader}
            selectionId={selectionId}
          />}
        />
      </div>
    </div>
  )}</Observer>
}