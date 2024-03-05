import React from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import renderEmptyView from 'components/EmptyView'

import { BookShelfLoader } from 'loader'
import RecordBookItem from 'business/ResourceItem/RecordBookItem'
import { UserAreaView, PullRefreshLoadMore } from 'components'
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
      return <UserAreaView bottom='0'>
        <Navi title="书架" />
        <PullRefreshLoadMore
          isLoading={loader.isLoading}
          isEnded={loader.isEnded}
          isEmpty={loader.isEmpty}
          refresh={loader.refresh}
          loadMore={loader.loadMore}
        >
          {loader.isEmpty && renderEmptyView(loader)}
          {loader.items.map(item => <RecordBookItem
            item={item}
            router={router}
            key={item.id}
          />)}
        </PullRefreshLoadMore>
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