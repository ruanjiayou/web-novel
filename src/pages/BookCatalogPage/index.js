import React, { Fragment, useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'

import { BookCatalogLoader } from 'loader/index'
import { MIconView, LoaderListView } from 'components'
import ChapterItemView from 'business/ChapterItemView'
import createPageModel from 'page-group-loader-model/BasePageModel'
import { useEffectOnce } from 'react-use'

const model = createPageModel({
  BookCatalogLoader,
});

function View({ self, router, params, }) {
  const loader = self.BookCatalogLoader
  const localStore = useLocalStore(() => ({
    loading: false,
    sortASC: true,
    id: params.id,
  }))
  useEffectOnce(() => {
    loader.toggleSort()
  })
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh({ params: { id: localStore.id } })
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
              refresh={() => {
                const params = { id: localStore.id }
                loader.refresh({ params })
              }}
              renderItem={(item, sectionId, index) => (
                <ChapterItemView
                  nth={loader.sort === 'asc' ? parseInt(index) + 1 : loader.items.length - parseInt(index)}
                  item={item}
                  router={router}
                  sectionId={sectionId}
                  toggleLoading={() => localStore.loading = !localStore.loading}
                />
              )}
            />
          </div>
        </div>
      </Fragment>
    }
  }</Observer>
}

export default {
  group: {
    view: 'BookCatalog',
  },
  model,
  View,
}