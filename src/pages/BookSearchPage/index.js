import React, { Fragment, useEffect } from 'react'
import { Observer } from 'mobx-react-lite'
import { useRouterContext } from 'contexts/router'
import 'components/common.css'

import MIconView from 'components/MIconView'
import LoaderListView from 'components/LoaderListView'
import BookListLoader from 'loader/BookListLoader'
import BookItemView from 'business/BookItemView'
import GroupTreeLoader from 'loader/GroupTreeLoader'
import GroupTree from 'components/GroupTree'

export default function () {
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
      <div className="full-height">
        <div className="dd-common-alignside" style={{ height: 45, padding: '0 15px' }}>
          <MIconView type="FaChevronLeft" onClick={() => { router.back() }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            全部
        </div>
        </div>
        <div className="full-height-auto" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div>
            <GroupTree loader={loader} />
          </div>

          <div style={{ flex: 1 }}>
            <LoaderListView
              loader={booksLoader}
              renderItem={(item, selectionId, index) => <BookItemView
                item={item}
                router={router}
                selectionId={selectionId}
              />}
            />
          </div>
        </div>
      </div>
    </Fragment>}
  </Observer>
}