import React, { Fragment, useEffect, useCallback } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ActivityIndicator, Icon, Button, Toast, Tag } from 'antd-mobile'

import timespan from 'utils/timespan'
import { ResourceLoader, RecommendResourceListLoader } from 'loader'
import { MIconView, AutoCenterView, VisualBoxView, EmptyView, UserAreaView } from 'components'
import ResourceItem from 'business/ResourceItem'
import createPageModel from 'page-group-loader-model/BasePageModel'
import Recorder from 'utils/cache'
import { useEffectOnce, useUnmount } from 'react-use'
import Player from '../../components/Player'
import services from '../../services/index'
import { EpTag } from './style'

const videoRecorder = new Recorder('video')
const model = createPageModel({
  ResourceLoader,
  RecommendResourceListLoader,
})

function View({ self, router, store, services, params }) {
  const loader = self.ResourceLoader
  const recommendsLoader = self.RecommendResourceListLoader
  const lineLoader = store.lineLoader
  const localStore = useLocalStore(() => ({
    loading: false,
    firstLoading: false,
    shouldFix: true,
    id: params.id,
    playpath: '',
    child_id: '',
    looktime: 0,
    watched: 0,
    get type() {
      if (this.playpath.endsWith('.m3u8') || this.playpath.endsWith('.ts')) {
        return 'hls'
      } else if (this.playpath.endsWith('.flv')) {
        return 'flv'
      } else {
        return 'mpeg'
      }
    },
    setRecorder(child_id = '', looktime = 0) {
      if (loader.item) {
        const data = loader.item.toJSON();
        videoRecorder.getValue(params.id).then(() => {
          videoRecorder.setValue(localStore.id, data, { child_id, time: looktime })
        })
      }
    },
    updateHistory(time) {
      // localStore.setRecorder(localStore.child_id, time);
      services.createHistory({
        resource_id: loader.item.id,
        resource_type: loader.item.source_type,
        media_id: localStore.child_id,
        media_type: 'video',
        watched: Math.floor(time),
        total: loader.item.words,
      });
    }
  }))

  useEffect(() => {
    params.id && loader.refresh({ params: { id: params.id } }, async (res) => {
      const query = {};
      if (res.item.tags) {
        query.tags = res.item.tags;
      }
      query.source_type = res.item.source_type;
      recommendsLoader.refresh({ query })
      const child = res.item.children.find(child => child.id === localStore.child_id) || res.item.children[0]
      if (child) {
        localStore.child_id = child.id
        localStore.playpath = lineLoader.getHostByType(child.path.endsWith('m3u8') || child.path.endsWith('ts') ? 'hls' : (child.path.endsWith('flv') ? 'hls' : 'video')) + child.path;
      }
    })
    videoRecorder.getValue(params.id).then(result => {
      if (result && result.data && result.option) {
        localStore.child_id = result.option.child_id;
        localStore.looktime = result.option.time;
      }
    })
  }, [params.id]);
  useEffectOnce(() => {
    return () => {
      localStore.updateHistory(localStore.watched);
      loader.clear()
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
          <UserAreaView bgcTop={'black'}>
            <div className="full-height-fix">
              <Player
                router={router}
                type={localStore.type}
                resource={loader.item}
                srcpath={localStore.playpath}
                looktime={localStore.looktime}
                next={recommendsLoader.items[0]}
                playNext={() => {
                  const index = loader.item.children.findIndex(child => child.id === localStore.child_id)
                  if (index + 1 !== loader.item.children.length) {
                    localStore.child_id = loader.item.children[index + 1].id;
                    localStore.looktime = 0
                    localStore.setRecorder(localStore.child_id, localStore.looktime)
                    localStore.playpath = lineLoader.getHostByType('video') + loader.item.children[index + 1].path;
                  }
                }}
                onRecord={(time) => {
                  // localStore.updateHistory(time)
                  localStore.looktime = time
                }}
                onTimeUpdate={time => {
                  localStore.watched = time;
                }}
              />
            </div>
            <div className="full-height-auto">
              <div style={{ padding: '0 20px', }}>
                <h2>{loader.item.title}</h2>
                <VisualBoxView visible={loader.item.children.length > 1}>
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
                </VisualBoxView>
                <p style={{ marginBottom: 8 }}>内容简介:</p>
                <div style={{ lineHeight: 1.5, color: '#555', textIndent: 20 }} dangerouslySetInnerHTML={{ __html: loader.item.desc || '暂无' }}></div>
                <div className="dd-common-alignside" style={{ margin: '5px 50px' }}>
                  <MIconView type="FaHeart" style={{ color: loader.item.marked ? '#e54e36' : '#848484' }} onClick={() => {
                    loader.item.setMarked(!loader.item.marked)
                  }} />
                </div>
                <VisualBoxView visible={loader.item.tags.length > 0}>
                  <p style={{ margin: '5px 0' }}>标签:</p>
                  <div>{loader.item.tags.map(tag => (<EpTag key={tag} selected={false} onClick={e => {
                    router.pushView('Search', { tag });
                  }}>{tag}</EpTag>))}</div>
                </VisualBoxView>
              </div>
              {recommendsLoader.items.map(item => (
                <div key={item.id} style={{ margin: 10 }}>
                  <ResourceItem item={item} onClick={(it) => {
                    router.replaceView('VideoInfo', { id: it.id })
                  }} />
                </div>
              ))}
            </div>
          </UserAreaView>
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