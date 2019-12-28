import React, { useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import FilterRow from '../FitlerRow'
import { LoaderListView } from 'components'
import ResourceListLoader from 'loader/ResourceListLoader'
import ResourceItem from 'business/ResourceItem'
import * as _ from 'lodash'

export default function Filter({ self, loader, ...props }) {
  const resourceListLoader = ResourceListLoader.create()
  const lstore = useLocalStore(() => {
    return { query: _.cloneDeep(self.params) }
  })
  useEffect(() => {
    if (loader.item && resourceListLoader.isEmpty) {
      resourceListLoader.refresh({ query: lstore.query })
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
        resourceListLoader.refresh({ query })
      }} />))}</div>
      <div className="full-height-auto">
        <LoaderListView
          loader={resourceListLoader}
          loadMore={() => {
            let query = _.cloneDeep(self.params)
            self.children.forEach(row => {
              row.children.forEach(tag => {
                if (tag.attrs.selected) {
                  Object.assign(query, tag.params)
                }
              })
            })
            resourceListLoader.loadMore({ query })
          }}
          refresh={() => {
            let query = _.cloneDeep(self.params)
            self.children.forEach(row => {
              row.children.forEach(tag => {
                if (tag.attrs.selected) {
                  Object.assign(query, tag.params)
                }
              })
            })
            resourceListLoader.refresh({ query })
          }}
          renderItem={(item, selectionId, index) => <ResourceItem
            key={index}
            item={item}
            loader={resourceListLoader}
            selectionId={selectionId}
          />}
        />
      </div>
    </div>
  )}</Observer>
}