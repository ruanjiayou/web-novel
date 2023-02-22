import React, { Fragment, useEffect, useCallback } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ActivityIndicator, Icon, Tag } from 'antd-mobile'

import { ResourceLoader } from 'loader'
import { AutoCenterView, MIconView } from 'components'
import createPageModel from 'page-group-loader-model/BasePageModel'
import { ITag, Container, Screen } from './style'
import services from 'services'
import { useEffectOnce } from 'react-use'
import PinchZoom from 'components/PinchZoom/self'
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

const { createMark, getMark, destroyMark } = services
const model = createPageModel({
  ResourceLoader,
})
const RATIO = document.body.clientWidth / document.body.clientHeight;
function View({ self, router, store, params, Navi }) {
  const loader = ResourceLoader.create()
  let imageHost = store.lineLoader.getHostByType('image')
  const localStore = useLocalStore(() => ({
    loading: false,
    id: params.id,
    markStatus: 'dislike', // like/error
    markLoading: false,
    markError: false,
    full: false,
    filepath: '',
    initW: 1,
    initH: 1,
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
          {loader.item.poster && loader.item.poster !== loader.item.images[0] && <img src={imageHost + loader.item.poster} style={{ maxWidth: '100%' }} />}
          {loader.item.images.map((image, index) => (<img key={index} src={imageHost + image} style={{ maxWidth: '100%' }} onClick={(e) => {
            const { width, height } = e.currentTarget || {};
            const ratio = (width || 0) / (height || 1);
            // 长图
            localStore.initW = RATIO > ratio ? width * document.body.clientHeight / height : document.body.clientWidth;
            // 宽图
            localStore.initH = RATIO > ratio ? document.body.clientHeight : height * document.body.clientWidth / width;
            localStore.filepath = imageHost + image;
            localStore.full = true;
          }} />))}
          <Container style={{ margin: 10 }}>
            {loader.item && loader.item.tags.map((tag, index) => <ITag key={index} disabled>{tag}</ITag>)}
          </Container>
        </Fragment>}
      </div>
      {localStore.full && (
        <Screen>
          <PinchZoom onTap={() => {
            localStore.full = false;
          }}>
            <img key={localStore.filepath} style={{ width: localStore.initW, height: localStore.initH, position: 'absolute', top: '50vh', left: '50vw', transform: 'translate(-50%,-50%)' }} src={localStore.filepath} />
          </PinchZoom>

          {/* <PhotoProvider onVisibleChange={(v, i) => {
            localStore.full = v
          }}>
            <PhotoView src={localStore.filepath}>
              <img src={localStore.filepath} alt="" />
            </PhotoView>
          </PhotoProvider> */}
        </Screen>

      )}
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