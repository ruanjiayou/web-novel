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
    child_id: '',
    looktime: 0,
    get type() {
      if (this.playpath.endsWith('.m3u8')) {
        return 'hls'
      } else if (this.playpath.endsWith('.flv')) {
        return 'flv'
      } else {
        return 'mpeg'
      }
    },
    setRecorder(child_id = '', looktime = 0) {
      if (loader.item) {
        videoRecorder.getValue(params.id).then(() => {
          videoRecorder.setValue(localStore.id, loader.item.toJSON(), { child_id, time: looktime })
        })
      }
    }
  }))
  useEffectOnce(() => {
    videoRecorder.getValue(params.id).then(result => {
      if (result && result.data && result.option) {
        localStore.child_id = result.option.child_id;
        localStore.looktime = result.option.time;
      }
    })
    return (() => {
      loader.clear()
    })
  })
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh({ params: { id: localStore.id } }, async (res) => {
        const child = res.item.children.find(child => child.id === localStore.child_id) || res.item.children[0]
        if (child) {
          localStore.child_id = child.id
          localStore.playpath = lineLoader.getHostByType(child.path.endsWith('m3u8') ? 'hls' : (child.path.endsWith('flv') ? 'hls' : 'video')) + child.path;
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
                type={localStore.type}
                resource={loader.item}
                srcpath={localStore.playpath}
                looktime={localStore.looktime}
                playNext={() => {
                  const index = loader.item.children.findIndex(child => child.id === localStore.child_id)
                  if (index + 1 !== loader.item.children.length) {
                    localStore.child_id = loader.item.children[index + 1].id;
                    localStore.looktime = 0
                    localStore.setRecorder(localStore.child_id, localStore.looktime)
                    localStore.playpath = lineLoader.getHostByType('video') + loader.item.children[index + 1].path;
                  }
                }}
                onRecord={async (time) => {
                  localStore.setRecorder(localStore.child_id, time);
                }}
              />
              <div style={{ padding: '0 20px', }}>
                <p style={{ fontWeight: 'bolder', margin: 0, padding: '5px 0' }}>播放列表:</p>
                <div>{loader.item.children.map(child => (
                  <EpTag
                    key={child.path}
                    onClick={() => {
                      if (localStorage.child_id !== child.id) {
                        localStore.child_id = child.id
                        localStore.looktime = 0
                        localStore.playpath = lineLoader.getHostByType('video') + child.path;
                        localStore.setRecorder(localStore.child_id, localStore.looktime)
                      }
                    }}
                    selected={localStore.child_id === child.id}>{child.title || `第${child.nth}集`}</EpTag>
                ))}
                </div>
                <p style={{ marginBottom: 8 }}>内容简介:</p>
                <div style={{ lineHeight: 1.5, color: '#555', textIndent: 20 }} dangerouslySetInnerHTML={{ __html: loader.item.desc || '暂无' }}></div>
                <p style={{ margin: '5px 0' }}>标签:</p>
                <div>{loader.item.tags.map(tag => (<EpTag key={tag} selected={false}>{tag}</EpTag>))}</div>
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