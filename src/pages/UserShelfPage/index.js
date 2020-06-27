import React, { Fragment } from 'react'
import { useEffectOnce } from 'react-use'
import { Button } from 'antd-mobile'
import { Observer, useLocalStore } from 'mobx-react-lite'

import { BookShelfLoader } from 'loader'
import BookItem from 'business/ResourceItem/BookItem'
import { LoaderListView, AutoCenterView } from 'components'
import createPageModel from 'page-group-loader-model/BasePageModel'

const model = createPageModel({
  BookShelfLoader,
})


function View({ self, router, store, Navi }) {
  const loader = self.BookShelfLoader
  const localStore = useLocalStore(() => ({
    loading: false,

  }))
  useEffectOnce(() => {
    if (loader.isEmpty) {
      loader.refresh()
    }
  })
  return <Observer>{
    () => {
      return <Fragment>
        <Navi title="书架" />
        <LoaderListView
          loader={loader}
          renderEmpty={(
            <AutoCenterView>
              <Button type="primary" inline onClick={() => { router.pushView('/auth/login') }}>登录</Button>
            </AutoCenterView>
          )}
          renderItem={(item, sectionId, index) => (
            <BookItem
              item={item}
              router={router}
              sectionId={sectionId}
              toggleLoading={() => localStore.loading = !localStore.loading}
            />
          )}
        />
      </Fragment>
    }
  }</Observer>
}

export default {
  group: {
    view: 'UserShelf',
  },
  View,
  model,
}