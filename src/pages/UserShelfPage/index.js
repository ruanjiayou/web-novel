import React, { Fragment } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'

import { useRouterContext } from 'contexts/router'
import BookItemView from 'business/BookItemView'
import LoaderListView from 'components/LoaderListView'
import globalStore from 'global-state'

export default function () {
  const router = useRouterContext()
  const loader = globalStore.bookShelfLoader
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
        <LoaderListView
          loader={loader}
          renderItem={(item, sectionId, index) => (
            <BookItemView
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