import React, { Fragment, useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ActivityIndicator, Icon } from 'antd-mobile'

import { useRouterContext, useStoreContext, useNaviContext } from 'contexts'
import { AutoCenterView } from 'components'
import ResourceLoader from 'loader/ResourceLoader'

export default function () {
  const Navi = useNaviContext()
  const router = useRouterContext()
  const loader = ResourceLoader.create()
  const store = useStoreContext()
  const params = router.params
  let imageHost = store.lineLoader.getHostByType('image')
  const localStore = useLocalStore(() => ({
    loading: false,
    id: params.id,
  }))
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh({ params: { id: localStore.id } })
    }
  })
  return <Observer>{
    () => <div className="full-height">
      <Navi title={loader.item ? loader.item.title : '加载中...'} />
      <div className="full-height-auto">
        {loader.isEmpty ? <AutoCenterView>
          <ActivityIndicator text="加载中..." />
        </AutoCenterView> : <Fragment>
            <img src={imageHost + loader.item.poster} />
            {loader.item.images.map((image, index) => (<img key={index} src={imageHost + image} />))}
          </Fragment>}
      </div>
    </div>
  }</Observer>
}