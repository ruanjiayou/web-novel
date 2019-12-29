import React from 'react'
import { Observer } from 'mobx-react-lite'
import FilterRow from '../FitlerRow'
import { LoaderListView } from 'components'
import ResourceItem from 'business/ResourceItem'
import * as _ from 'lodash'

export default function Filter({ self, loader, subLoader, ...props }) {
  return <Observer>{() => (
    <div className="full-height">
      <div onTouchStart={e => {
        e.stopPropagation()
        e.preventDefault()
      }}>{self.children.map(child => (<FilterRow self={child} key={child.id} onQueryChange={() => {
        const query = loader.getQuery()
        subLoader.refresh({ query })
      }} />))}</div>
      <div className="full-height-auto">
        <LoaderListView
          loader={subLoader}
          loadMore={() => {
            const query = loader.getQuery()
            subLoader.loadMore({ query })
          }}
          refresh={() => {
            const query = loader.getQuery()
            subLoader.refresh({ query })
          }}
          renderItem={(item, selectionId, index) => <ResourceItem
            key={index}
            item={item}
            loader={subLoader}
            selectionId={selectionId}
          />}
        />
      </div>
    </div>
  )}</Observer>
}