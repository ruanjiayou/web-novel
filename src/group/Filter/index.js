import React, { useEffect, useCallback } from 'react'
import { useMount } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import FilterRow from '../FitlerRow'
import { LoaderListView, MIconView } from 'components'
import ResourceItem from 'business/ResourceItem'
import { useStoreContext } from 'contexts'
import ResourceListLoader from 'loader/ResourceListLoader'

export default function Filter({ self, loader, ...props }) {
  const store = useStoreContext()
  const lstore = useLocalStore(() => ({
    loader: store.resourceListLoaders[loader.item.id] || ResourceListLoader.create(),
    filterHeight: 0,
    showShort: false,
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
    <div className="full-height" style={{ position: 'relative' }}>
      {lstore.showShort && <div onClick={() => {
        lstore.showShort = false
      }} style={{ position: 'absolute', top: 0, width: '100%', zIndex: 2, fontWeight: 600, height: 32, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #ccc' }}>
        {self.selectedArr.join(' · ')} <MIconView type="FaAngleLeft" style={{ transform: 'rotate(-90deg)' }} />
      </div>}
      <div className="" style={{ display: lstore.showShort ? 'none' : 'block' }} ref={ref => {
        if (ref) {
          lstore.filterHeight = Math.max(ref.offsetHeight * 2, lstore.filterHeight)
        }
      }} onTouchStart={e => {
        e.stopPropagation()
        e.preventDefault()
      }}>
        {self.children.map(child => (<FilterRow self={child} key={child.id} onQueryChange={refresh} />))}
      </div>
      <LoaderListView
        loader={lstore.loader}
        loadMore={() => {
          const query = loader.getQuery()
          lstore.loader.loadMore({ query })
        }}
        onScroll={(e) => {
          if (e.target.scrollTop > lstore.filterHeight && lstore.filterHeight !== 0) {
            lstore.showShort = true
          } else {
            lstore.showShort = false
          }
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
  )}</Observer>
}