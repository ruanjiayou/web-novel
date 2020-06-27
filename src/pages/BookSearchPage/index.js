import React, { Fragment, useEffect } from 'react'
import { Observer } from 'mobx-react-lite'

import { useNaviContext, useRouterContext } from 'contexts/'
import loaders from 'loader'
import { RenderGroups } from 'group'
import createPageModel from 'page-group-loader-model/BasePageModel'

export const ViewModel = createPageModel({
  ResourceListLoader: loaders.ResourceListLoader,
  GroupTreeLoader: loaders.GroupTreeLoader
})

export default function ({ self }) {
  const Navi = useNaviContext()
  const router = useRouterContext()
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