import React, { Fragment, useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useRouterContext } from 'contexts/router'
import 'components/common.css'

import BookModel from 'models/BookModel'
import services from 'services'
import { createItemsLoader } from 'loader/BaseLoader'
import LoaderListView from 'components/LoaderListView'
import MIconView from 'components/MIconView'
import BookItemView from 'business/BookItemView'

export default function () {
  const router = useRouterContext()
  const localStore = useLocalStore(() => ({
    query: {},
  }))
  const loader = createItemsLoader(BookModel, async (params) => services.getBookList(params)).create()
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh()
    }
  })
  return <Observer>{
    () => <Fragment>
      <div className="dd-common-alignside" style={{ height: 45, padding: '0 15px' }}>
        <MIconView type="FaChevronLeft" onClick={() => { router.back() }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          全部
        </div>
      </div>
      <div>TODO:过滤条件</div>
      <LoaderListView
        loader={loader}
        renderItem={(item, selectionId, index) => <BookItemView
          item={item}
          router={router}
          selectionId={selectionId}
        />}
      />
    </Fragment>}
  </Observer>
}