import React, { Fragment } from 'react'
import { useEffectOnce } from 'react-use'
import { Button } from 'antd-mobile'
import { Observer, useLocalStore } from 'mobx-react-lite'

import { BookShelfLoader } from 'loader'
import RecordBookItem from 'business/ResourceItem/RecordBookItem'
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
      return <div className='full-height' style={{ height: 'calc(100% - env(safe-area-inset-bottom) - env(safe-area-inset-top))' }}>
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
      </div>
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