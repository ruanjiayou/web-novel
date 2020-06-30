import React, { Fragment, useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ActivityIndicator, Icon, Tag } from 'antd-mobile'

import { ResourceLoader } from 'loader'
import { AutoCenterView } from 'components'
import createPageModel from 'page-group-loader-model/BasePageModel'

const model = createPageModel({
  ResourceLoader,
})

function View({ self, router, store, params, Navi }) {
  const loader = ResourceLoader.create()
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
              {loader.item.tags.map((tag, index) => <Tag key={index} disabled>{tag}</Tag>)}
            </div>
            <img src={imageHost + loader.item.poster} style={{ maxWidth: '100%' }} />
            {loader.item.images.map((image, index) => (<img key={index} src={imageHost + image} style={{ maxWidth: '100%' }} />))}
          </Fragment>}
      </div>
    </div>
  }</Observer>
}

export default {
  group: {
    view: 'Image',
  },
  model,
  View,
}