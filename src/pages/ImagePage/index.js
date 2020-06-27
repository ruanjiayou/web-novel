import React, { Fragment, useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ActivityIndicator, Icon, Tag } from 'antd-mobile'

import { useRouterContext, useStoreContext, useNaviContext } from 'contexts'
import { AutoCenterView } from 'components'
import loaders from 'loader'
import createPageModel from 'page-group-loader-model/BasePageModel'

export const ViewModel = createPageModel({
  ChapterLoader: loaders.ChapterLoader
})

export default function ({self}) {
  const Navi = useNaviContext()
  const router = useRouterContext()
  const loader = self.ResourceLoader
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
      <Navi title={loader.item ? loader.item.title + ' ' + loader.item.uname : '加载中...'} />
      <div className="full-height-auto">
        {loader.isEmpty ? <AutoCenterView>
          <ActivityIndicator text="加载中..." />
        </AutoCenterView> : <Fragment>
            <div style={{ margin: 10 }}>
              {loader.item.tags.map(tag => <Tag disabled>{tag}</Tag>)}
            </div>
            <img src={imageHost + loader.item.poster} style={{ maxWidth: '100%' }} />
            {loader.item.images.map((image, index) => (<img key={index} src={imageHost + image} style={{ maxWidth: '100%' }} />))}
          </Fragment>}
      </div>
    </div>
  }</Observer>
}