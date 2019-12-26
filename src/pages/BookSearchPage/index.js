import React, { Fragment, useEffect } from 'react'
import { Observer } from 'mobx-react-lite'

import { useNaviContext, useRouterContext } from 'contexts/'
import BookListLoader from 'loader/BookListLoader'
import GroupTreeLoader from 'loader/GroupTreeLoader'
import { RenderGroups } from 'group'

export default function () {
  const Navi = useNaviContext()
  const router = useRouterContext()
  const loader = GroupTreeLoader.create()
  const booksLoader = BookListLoader.create()
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh({ params: { group_id: 'D5698713D07045ADBBF5F0D5D09E53E4' } })
    }
    if (booksLoader.isEmpty) {
      booksLoader.refresh()
    }
  })
  return <Observer>{
    () => <Fragment>
      <Navi title="全部" router={router} />
      <div className="full-height-auto" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ height: '100%' }}>
          <RenderGroups loader={loader} onQueryChange={query => {
            booksLoader.refresh({ query })
          }} />
        </div>
      </div>
    </Fragment>}
  </Observer>
}