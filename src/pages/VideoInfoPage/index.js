import React, { Fragment, useEffect, useCallback } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ActivityIndicator, Icon, Button, Toast, Tag } from 'antd-mobile'

import timespan from 'utils/timespan'
import { ResourceLoader } from 'loader'
import { MIconView, AutoCenterView, VisualBoxView, EmptyView } from 'components'
import createPageModel from 'page-group-loader-model/BasePageModel'
import Recorder from 'utils/cache'
import { useEffectOnce } from 'react-use'
import Player from '../../components/Player'
import { EpTag } from './style'

const videoRecorder = new Recorder('video')
const model = createPageModel({
  ResourceLoader,
})

function View({ self, router, store, services, params }) {
  const loader = self.ResourceLoader
  const lineLoader = store.lineLoader
  const localStore = useLocalStore(() => ({
    loading: false,
    firstLoading: false,
    shouldFix: true,
    id: params.id,
    playpath: '',
    nth: 1,
  }))
  useEffectOnce(() => {
    videoRecorder.getValue(params.id).then(result => {
      if (result) {

      }
    })
    return (() => {
      loader.clear()
    })
  })
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh({ params: { id: localStore.id } }, async (res) => {
        const item = res.item.children[0]
        if (item) {
          localStore.nth = item.nth;
          localStore.playpath = lineLoader.getHostByType('video') + item.path;
        }
      })
    }
  })
  return <Observer>{
    () => {
      if (loader.isLoading) {
        return <AutoCenterView>
          <ActivityIndicator text="加载中..." />
        </AutoCenterView>
      } else if (loader.isEmpty) {
        return EmptyView(loader, <div>empty</div>, function () {
          loader.refresh({ params: { id: localStore.id } })
        })
      } else {
        return <Fragment>
          <div className="full-height">
            <div className="full-height-auto">
              <Player
                router={router}
                resource={loader.item}
                srcpath={localStore.playpath}
                playNext={localStore.nth === loader.item.children.length ? null : () => {
                  const child = loader.item.children[localStore.nth + 1]
                  if (child) {
                    localStore.nth = localStore.nth + 1;
                    localStore.playpath = lineLoader.getHostByType('video') + child.path;
                  }
                }}
              />
              <div style={{ padding: '0 20px', borderBottom: '1px solid #ccc', backgroundColor: 'snow' }}>
                <p style={{ marginBottom: 8 }}>内容简介:</p>
                <div style={{ lineHeight: 1.5, color: '#555', textIndent: 20, borderBottom: '1px solid #ccc', minHeight: 120 }} dangerouslySetInnerHTML={{ __html: loader.item.desc }}>
                </div>
                <p style={{ fontWeight: 'bolder', margin: 0, padding: '5px 0' }}>播放列表:</p>
                <div>{loader.item.children.map(child => (
                  <EpTag
                    key={child.path}
                    onClick={() => { if (localStorage.nth !== child.nth) { localStore.nth = child.nth; localStore.playpath = lineLoader.getHostByType('video') + child.path; } }}
                    selected={localStore.nth === child.nth}>{child.title || `第${child.nth}集`}</EpTag>
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
    view: 'VideoInfo',
  },
  model,
  View,
}