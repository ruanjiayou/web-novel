import React, { Fragment, useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useRouterContext } from 'contexts/router'

import 'components/common.css'
import MIconView from 'components/MIconView'
import LoaderListView from 'components/LoaderListView'
import ChapterItemView from 'business/ChapterItemView'

import services from 'services'
import ChapterModel from 'models/ChapterModel'
import { createItemsLoader } from 'loader/BaseLoader'

export default function () {
  const router = useRouterContext()
  const loader = createItemsLoader(ChapterModel, async (params) => services.getBookCatalog(params), { query: { sort: 'id-asc' } }).create()
  const localStore = useLocalStore(() => ({
    loading: false,
    sortASC: true,
  }))
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh({ id: router.getStateKey('id') })
    }
  })
  return <Observer>{
    () => {
      return <Fragment>
        <div className="full-height">
          <div className="dd-common-alignside" style={{ height: 45, padding: '0 15px' }}>
            <MIconView type="FaChevronLeft" onClick={() => { router.back() }} />
            <div className="dd-common-alignside">
              <span style={{ padding: '0 10px' }}>目录</span>
              <span style={{ padding: '0 10px' }}>书签</span>
            </div>
            <div className="dd-common-alignside" onClick={() => {
              localStore.sortASC = !localStore.sortASC
              loader.toggleSort()
            }}>
              <MIconView type={localStore.sortASC ? 'FaSortNumericDown' : 'FaSortNumericUp'} />
              {localStore.sortASC ? '正序' : '倒序'}
            </div>

          </div>
          <div className="full-height-auto">
            <LoaderListView
              loader={loader}
              renderItem={(item, sectionId, index) => {
                return <ChapterItemView
                  nth={loader.sort === 'asc' ? parseInt(index) + 1 : loader.items.length - parseInt(index)}
                  item={item}
                  router={router}
                  sectionId={sectionId}
                  toggleLoading={() => localStore.loading = !localStore.loading}
                />
              }}
            />
          </div>
        </div>
      </Fragment>
    }
  }</Observer>
}