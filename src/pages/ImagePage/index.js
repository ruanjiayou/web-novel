import React, { Fragment, useEffect, useCallback } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ActivityIndicator, Icon, Tag } from 'antd-mobile'

import { ResourceLoader } from 'loader'
import { AutoCenterView, MIconView } from 'components'
import createPageModel from 'page-group-loader-model/BasePageModel'
import { ITag, Container } from './style'
import services from 'services'
import { useEffectOnce } from 'react-use'

const { createMark, getMark, destroyMark } = services
const model = createPageModel({
  ResourceLoader,
})

function View({ self, router, store, params, Navi }) {
  const loader = ResourceLoader.create()
  let imageHost = store.lineLoader.getHostByType('image')
  const localStore = useLocalStore(() => ({
    loading: false,
    id: params.id,
    markStatus: 'dislike', // like/error
    markLoading: false,
    markError: false,
  }))
  const MStatus = function () {
    if (localStore.markLoading) {
      return <ActivityIndicator animating={true} />
    } else if (localStore.markError) {
      return <MIconView type="FaSyncAlt" />
    } else if (localStore.markStatus === 'dislike') {
      return <MIconView type="FaHeart" style={{ color: 'white' }} />
    } else {
      return <MIconView type="FaHeart" style={{ color: 'red' }} />
    }
  }
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh({ params: { id: localStore.id } })
    }
  })
  useEffectOnce(() => {
    getMark({ params }).then(result => {
      if (result.status === 'success') {
        localStore.markStatus = 'like'
      }
    })
  })
  return <Observer>{
    () => <div className="full-height">
      <Navi
        title={loader.item ? loader.item.title + ' ' + loader.item.uname : '加载中...'}
      >
        <div onClick={async () => {
          if (localStore.markLoading) return
          localStore.markLoading = true
          try {
            if (localStore.markStatus === 'dislike') {
              await createMark({ data: params })
              localStore.markStatus = 'like'
            } else {
              await destroyMark({ params })
              localStore.markStatus = 'dislike'
            }
          } catch (e) {
            localStore.markError = true
          } finally {
            localStore.markLoading = false
          }
        }}>
          {MStatus()}
        </div>
      </Navi>
      <div className="full-height-auto">
        {loader.isEmpty ? <AutoCenterView>
          <ActivityIndicator text="加载中..." />
        </AutoCenterView> : <Fragment>
            {loader.item.poster !== loader.item.images[0] && <img src={imageHost + loader.item.poster} style={{ maxWidth: '100%' }} />}
            {loader.item.images.map((image, index) => (<img key={index} src={imageHost + image} style={{ maxWidth: '100%' }} />))}
          </Fragment>}
      </div>
      <Container style={{ position: 'absolute', left: 5, right: 5, bottom: 5 }}>
        {loader.item && loader.item.tags.map((tag, index) => <ITag key={index} disabled>{tag}</ITag>)}
      </Container>
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