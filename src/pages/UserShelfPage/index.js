import React, { Fragment } from 'react'
import { useEffectOnce } from 'react-use'
import { Button } from 'antd-mobile'
import { Observer, useLocalStore } from 'mobx-react-lite'

import { BookShelfLoader } from 'loader'
import RecordBookItem from 'business/ResourceItem/RecordBookItem'
import { LoaderListView, AutoCenterView, UserAreaView } from 'components'
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
      return <UserAreaView>
        <Navi title="书架" />
        <LoaderListView
          loader={loader}
          renderEmpty={(
            <AutoCenterView>
              <Button type="primary" inline onClick={() => { router.pushView('login') }}>登录</Button>
            </AutoCenterView>
          )}
          renderItem={(item, sectionId, index) => (
            <RecordBookItem
              item={item}
              router={router}
              sectionId={sectionId}
              toggleLoading={() => localStore.loading = !localStore.loading}
            />
          )}
        />
      </UserAreaView>
    }
  }</Observer >
}

export default {
  group: {
    view: 'UserShelf',
  },
  View,
  model,
}