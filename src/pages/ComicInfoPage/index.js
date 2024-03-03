import React, { Fragment, useEffect, useCallback } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ActivityIndicator, Icon, Button, Toast } from 'antd-mobile'

import timespan from 'utils/timespan'
import { GalleryListLoader, ResourceLoader } from 'loader'
import { MIconView, AutoCenterView, VisualBoxView, EmptyView, UserAreaView } from 'components'
import createPageModel from 'page-group-loader-model/BasePageModel'
import Recorder from 'utils/cache'
import { useEffectOnce } from 'react-use'
import GalleryItem from 'business/GalleryItemView'
import { useNaviContext } from 'contexts'

const comicRecorder = new Recorder('comic')
const model = createPageModel({
  ResourceLoader,
  GalleryListLoader,
})

function View({ self, router, store, services, params }) {
  const loader = self.ResourceLoader
  const Navi = useNaviContext();
  const galleries = self.GalleryListLoader
  const localStore = useLocalStore(() => ({
    loading: false,
    firstLoading: false,
    shouldFix: false,
    cached: false,
    id: params.id,
  }))
  const toogleCache = useCallback(async () => {
    if (loader.isEmpty) {
      return Toast.info('加载中...')
    }
    if (localStore.cached) {
      comicRecorder.removeKey(params.id)
    } else {
      //TODO:

    }
    localStore.cached = !localStore.cached
  })
  useEffectOnce(() => {
    comicRecorder.getValue(params.id).then(result => {
      if (result) {
        localStore.cached = true
      }
    })
    return (() => {
      loader.clear()
      galleries.clear()
    })
  }, [params.id])
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh({ params: { id: params.id } })
    }
    if (galleries.isEmpty) {
      galleries.refresh({ params: { bid: params.id } })
    }
  }, [params.id])
  return <Observer>{
    () => {
      if (loader.isLoading) {
        return <AutoCenterView>
          <ActivityIndicator text="加载中..." />
        </AutoCenterView>
      } else if (loader.isEmpty) {
        return EmptyView(loader, <div>empty</div>, function () {
          loader.refresh({ params: { id: params.id } })
        })
      } else {
        return <Fragment>
          <UserAreaView bgcTop={'black'}>
            <div className="dd-common-alignside" style={{ position: 'absolute', width: '100%', boxSizing: 'border-box', height: 45, padding: '0 15px' }}>
              <MIconView type="FaChevronLeft" onClick={() => { router.back() }} />
              <div>
                <VisualBoxView visible={localStore.shouldFix}>
                  <div>{loader.item.title}</div>
                  <div>{loader.item.uname} · {loader.item.type}</div>
                </VisualBoxView>
              </div>
              <MIconView type="FaEllipsisH" />
            </div>
            <div className="full-height-auto">
              <div style={{ padding: '20px 0 10px 0', textAlign: 'center', backgroundColor: '#bfbaba', color: 'white' }}>
                <img src={loader.item.auto_cover} alt="" width={100} height={120} />
                <div style={{ fontSize: 20, padding: 5 }}>{loader.item.title}</div>
                <div>{loader.item.uname} · {loader.item.type}</div>
              </div>
              <div style={{ padding: '0 20px', backgroundColor: 'snow' }}>
                <div className="dd-common-alignside" style={{ height: 50 }}>
                  <div className="dd-common-centerXY" style={{ flex: 1 }}>
                    {Math.round(loader.item.words / 10000)}万字
                  </div>
                  <div className="dd-common-centerXY" style={{ flex: 1 }}>
                    {loader.item.chapters}章
                  </div>
                  <div className="dd-common-centerXY" style={{ flex: 1 }}>
                    {loader.item.comments}评论
                  </div>
                </div>
                <div className="dd-common-alignside">
                  <Button type="primary" size="small" loading={localStore.firstLoading} onClick={async () => {
                    try {
                      localStore.firstLoading = true
                      const info = await services.getBookFirstChapter({ params: { id: localStore.id } })
                      router.pushView('ComicGallery', { bid: localStore.id, id: info.item.id })
                    } catch (err) {

                    } finally {
                      localStore.firstLoading = false
                    }
                  }}>
                    立即阅读
                  </Button>
                  <Button type={localStore.cached ? 'ghost' : 'primary'} size="small" onClick={toogleCache}>{localStore.cached ? '移出书架' : '加入书架'}</Button>
                  <Button type="ghost" size="small" style={{ minWidth: 82 }} onClick={() => {
                    window.open(`${store.app.baseURL}/v1/public/download/book/${localStore.id}`, '_blank')
                  }}>下载</Button>
                </div>
                <p style={{ marginBottom: 8 }}>内容简介:</p>
                <div style={{ lineHeight: 1.5, color: '#555', textIndent: 20, borderBottom: '1px solid #ccc', minHeight: 120 }} dangerouslySetInnerHTML={{ __html: loader.item.desc }}>
                </div>
              </div>
              <div>
                {galleries.items.map(item => (<GalleryItem router={router} key={item.id} item={item} />))}
              </div>
            </div>
          </UserAreaView>
        </Fragment>
      }
    }
  }</Observer>
}

export default {
  group: {
    view: 'ComicInfo',
  },
  model,
  View,
}