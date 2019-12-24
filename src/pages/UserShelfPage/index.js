import React, { Fragment } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'

import { useRouterContext } from 'contexts/router'
import BookItem from 'business/ResourceItem/BookItem'
import LoaderListView from 'components/LoaderListView'
import AutoCenterView from 'components/AutoCenterView'
import globalStore from 'global-state'

import { Button } from 'antd-mobile'

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
          renderEmpty={(
            <AutoCenterView>
              <Button type="primary" inline onClick={() => { router.pushView('/auth/login', null, { hideMenu: true, showNavi: true }) }}>登录</Button>
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