import React, { Fragment, useEffect } from 'react'
import { Observer } from 'mobx-react-lite'

import { RenderGroups } from 'group'
import {ResourceListLoader,GroupTreeLoader} from 'loader'
import createPageModel from 'page-group-loader-model/BasePageModel'

const model = createPageModel({
  ResourceListLoader,
  GroupTreeLoader,
})

function View({ self, router, Navi }) {
  const loader = self.GroupTreeLoader
  const booksLoader = self.ResourceListLoader
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh({ params: { name: 'book-search-all' } })
    }
    if (booksLoader.isEmpty) {
      booksLoader.refresh({ query: { source_type: 'novel' } })
    }
  })
  return <Observer>{
    () => <Fragment>
      <Navi title="全部" router={router} />
      <div className="full-height-auto" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ height: '100%' }}>
          <RenderGroups loader={loader} onQueryChange={query => {
            booksLoader.refresh({ query: { ...query, source_type: 'novel' } })
          }} />
        </div>
      </div>
    </Fragment>}
  </Observer>
}

export default {
  group: {
    view: 'BookSearch',
  },
  View,
  model,
}