import React from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import FilterRow from '../FitlerRow'
import { LoaderListView } from 'components'
import ResourceListLoader from 'loader/ResourceListLoader'
import ResourceItem from 'business/ResourceItem'
import * as _ from 'lodash'

export default function Filter({ self, loader, ...props }) {
  const lstore = useLocalStore(() => {
    return { query: _.cloneDeep(self.params), resourceListLoader: ResourceListLoader.create() }
  })
  useEffectOnce(() => {
    if (loader.item && lstore.resourceListLoader.isEmpty) {
      lstore.resourceListLoader.refresh({ query: lstore.query })
    }
  }, [])
  return <Observer>{() => (
    <div className="full-height">
      <div onTouchStart={e => {
        e.stopPropagation()
        e.preventDefault()
      }}>{self.children.map(child => (<FilterRow self={child} key={child.id} onQueryChange={() => {
        let query = _.cloneDeep(lstore.query)
        self.children.forEach(child => {
          child.children.forEach(tag => {
            if (tag.attrs.selected) {
              Object.assign(query, tag.params)
            }
          })
        })
        lstore.resourceListLoader.refresh({ query })
      }} />))}</div>
      <div className="full-height-auto">
        <LoaderListView
          loader={lstore.resourceListLoader}
          loadMore={() => {
            let query = _.cloneDeep(lstore.query)
            self.children.forEach(row => {
              row.children.forEach(tag => {
                if (tag.attrs.selected) {
                  Object.assign(query, tag.params)
                }
              })
            })
            lstore.resourceListLoader.loadMore({ query })
          }}
          refresh={() => {
            let query = _.cloneDeep(lstore.query)
            self.children.forEach(row => {
              row.children.forEach(tag => {
                if (tag.attrs.selected) {
                  Object.assign(query, tag.params)
                }
              })
            })
            lstore.resourceListLoader.refresh({ query })
          }}
          renderItem={(item, selectionId, index) => <ResourceItem
            key={index}
            item={item}
            loader={lstore.resourceListLoader}
            selectionId={selectionId}
          />}
        />
      </div>
    </div>
  )}</Observer>
}