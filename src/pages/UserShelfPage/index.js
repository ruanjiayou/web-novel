import React, { Fragment } from 'react'
import { useEffectOnce } from 'react-use'
import { Button } from 'antd-mobile'
import { Observer, useLocalStore } from 'mobx-react-lite'

import { useRouterContext, useStoreContext, useNaviContext } from 'contexts'
import { LoaderListView, AutoCenterView } from 'components'
import BookItem from 'business/ResourceItem/BookItem'


export default function () {
  const globalStore = useStoreContext()
  const Navi = useNaviContext()
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
        <Navi title="书架"/>
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