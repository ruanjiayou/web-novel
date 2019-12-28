import React, { Fragment, useEffect } from 'react'
import { Observer } from 'mobx-react-lite'

import { useNaviContext, useRouterContext } from 'contexts/'
import ResourceListLoader from 'loader/ResourceListLoader'
import GroupTreeLoader from 'loader/GroupTreeLoader'
import { RenderGroups } from 'group'

export default function () {
  const Navi = useNaviContext()
  const router = useRouterContext()
  const loader = GroupTreeLoader.create()
  const booksLoader = ResourceListLoader.create()
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