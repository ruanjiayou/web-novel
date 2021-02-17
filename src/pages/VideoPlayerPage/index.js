import React, { Fragment, useEffect, useCallback } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ActivityIndicator, Icon, Button, Toast, Tag } from 'antd-mobile'

import { ResourceLoader } from 'loader'
import { MIconView, AutoCenterView, EmptyView } from 'components'
import createPageModel from 'page-group-loader-model/BasePageModel'
import { useEffectOnce } from 'react-use'

const model = createPageModel({
  ResourceLoader,
})

function View({ self, router, store, services, params }) {
  const loader = self.ResourceLoader
  const lineLoader = store.lineLoader
  const localStore = useLocalStore(() => ({
    loading: false,
    firstLoading: false,
    id: params.id,
    mid: params.mid,
    path: '',
  }))
  useEffectOnce(() => {
    return (() => {
      loader.clear()
    })
  })
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh({ params: { id: localStore.mid } }, async function (res) {
        const item = res.item.children.find(child => child.id === params.id)
        if (item) {
          localStore.path = item.path
        }
      })
    } else {
      const item = loader.item.children.find(child => child.id === params.id)
      if (item) {
        localStore.path = item.path
      }
    }
  }, [localStore.id])
  const Player = useCallback(() => (
    <div>
      <video style={{ height: 210 }} height="210" autoPlay controls>
        <source type="video/mp4" src={lineLoader.getHostByType('video') + localStore.path}></source>
      </video>
    </div>
  ), [localStore.id])
  return <Observer>{
    () => {
      if (loader.isLoading) {
        return <AutoCenterView>
          <ActivityIndicator text="加载中..." />
        </AutoCenterView>
      } else if (loader.isEmpty) {
        return EmptyView(loader, <div>empty</div>, function () {
          loader.refresh({ params: { id: localStore.mid } })
        })
      } else {
        return <Fragment>
          <div className="full-height">
            <div className="dd-common-alignside" style={{ width: '100%', boxSizing: 'border-box', height: 45, padding: '0 15px' }}>
              <MIconView type="FaChevronLeft" onClick={() => { router.back() }} />
              <MIconView type="FaEllipsisH" />
            </div>
            <div className="full-height-fix">
              <Player />
            </div>
            <div className="full-height-auto">
              <div style={{ padding: '4px 15px' }}>
                {loader.item.tags.map(tag => (<Tag key={tag} style={{ marginRight: 4 }} small selected={true} >{tag}</Tag>))}
              </div>
              <div style={{ padding: '0 20px', backgroundColor: 'snow' }}>
                <p style={{ fontWeight: 'bolder', margin: 0, padding: '5px 0' }}>播放列表:</p>
                <div>{loader.item.children.map(child => (
                  <span key={child.path}
                    style={{
                      display: 'inline-block',
                      fontSize: 12,
                      margin: 3,
                      borderRadius: 5,
                      padding: '2px 3px',
                      borderWidth: 1,
                      borderStyle: 'solid',
                      borderColor: child.id === localStore.id ? '#1693ff' : 'grey',
                      color: child.id === localStore.id ? '#1693ff' : 'grey',
                    }}
                    onClick={() => {
                      localStore.id = child.id
                      router.replaceView('VideoPlayer', { id: child.id, mid: localStore.mid })
                    }}>
                    {child.title || `第${child.nth}集`}
                  </span>
                ))}
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      }
    }
  }</Observer>
}

export default {
  group: {
    view: 'VideoPlayer',
  },
  model,
  View,
}