import React, { Fragment, useEffect } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { ActivityIndicator } from 'antd-mobile';

import { ResourceLoader, RecommendResourceListLoader } from 'loader';
import {
  MIconView,
  AutoCenterView,
  VisualBoxView,
  EmptyView,
  UserAreaView,
} from 'components';
import ResourceItem from 'business/ResourceItem';
import createPageModel from 'page-group-loader-model/BasePageModel';
import Recorder from 'utils/cache';
import { useEffectOnce } from 'react-use';
import Player2 from '../../components/Player2';
import { EpTag } from './style';
import apis from '../../services/index'
import showTip from 'utils/showTip';
import Clipboard from 'react-clipboard.js';
import { MdRefresh } from 'react-icons/md';

const videoRecorder = new Recorder('video');
const model = createPageModel({
  ResourceLoader,
  RecommendResourceListLoader,
});

function View({ self, router, store, services, params }) {
  const loader = self.ResourceLoader;
  const recommendsLoader = self.RecommendResourceListLoader;
  const lineLoader = store.lineLoader;
  const localStore = useLocalStore(() => ({
    loading: false,
    firstLoading: false,
    shouldFix: true,
    _id: '',
    playpath: '',
    subtitles: [],
    child_id: '',
    looktime: 0,
    watched: 0,
    get type() {
      if (this.playpath.endsWith('.m3u8') || this.playpath.endsWith('.ts')) {
        return 'hls';
      } else if (this.playpath.endsWith('.flv')) {
        return 'flv';
      } else {
        return 'mpeg';
      }
    },
    setRecorder(child_id = '', looktime = 0) {
      if (loader.item) {
        const data = loader.item.toJSON();
        videoRecorder.getValue(localStore._id).then(() => {
          videoRecorder.setValue(localStore._id, data, {
            child_id,
            time: looktime,
          });
        });
      }
    },
    query: {},
    updateHistory(time) {
      // localStore.setRecorder(localStore.child_id, time);
      services.createHistory({
        resource_id: loader.item._id,
        resource_type: loader.item.source_type,
        media_id: localStore.child_id,
        media_type: 'video',
        watched: Math.floor(time),
        total: loader.item.size,
      });
    },
  }));
  useEffect(() => {
    if (localStore._id && store.app.isLogin && localStore.watched) {
      localStore.updateHistory(localStore.watched);
    }
    localStore._id = params.id
    localStore._id &&
      loader.refresh({ params: { _id: localStore._id } }, async (res) => {
        const query = {};
        if (res.item.tags) {
          query.tags = res.item.tags;
        }
        query.source_type = res.item.source_type;
        localStore.query = query;
        recommendsLoader.refresh({ query });
        const child =
          res.item.videos.find((child) => child._id === localStore.child_id) ||
          res.item.videos[0];
        if (child) {
          localStore.child_id = child._id;
          localStore.playpath =
            lineLoader.getHostByType('video') + child.path;
          localStore.subtitles = child.subtitles || [];
        }
      });
    store.app.isLogin && localStore.id && apis.getHistoryDetail({ params: { id: params.id } }).then(resp => {
      if (resp.code === 0) {
        localStore.looktime = resp.data.watched;
      }
    }, [params.id])
    videoRecorder.getValue(localStore.id).then((result) => {
      if (result && result.data && result.option) {
        localStore.child_id = result.option.child_id;
        localStore.looktime = result.option.time;
      }
    });
  }, [params.id]);
  useEffectOnce(() => {
    return () => {
      if (store.app.isLogin) {
        localStore.updateHistory(localStore.watched);
      }
      loader.clear();
      recommendsLoader.clear();
    };
  });
  return (
    <Observer>
      {() => {
        if (loader.isLoading) {
          return (
            <AutoCenterView>
              <ActivityIndicator text="加载中..." />
            </AutoCenterView>
          );
        } else if (loader.isEmpty) {
          return EmptyView(loader, <div>empty</div>, function () {
            loader.refresh({ params: { _id: localStore._id } });
          });
        } else {
          return (
            <Fragment>
              <UserAreaView bgcTop={'black'} bottom="0">
                <div className="full-height-fix">
                  <Player2
                    resource={loader.item}
                    srcpath={localStore.playpath}
                    subtitles={localStore.subtitles}
                    looktime={localStore.looktime}
                    type={localStore.type}
                    onTimeUpdate={time => {
                      localStore.watched = time;
                    }}
                  />
                </div>
                <div className="full-height-auto">
                  <div style={{ padding: '0 20px' }}>
                    <Clipboard data-clipboard-text={loader.item._id} component={'a'}>
                      <h2>{loader.item.title}</h2>
                    </Clipboard>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
                      {loader.item.actors.map(actor => (<div key={actor._id} onClick={() => { router.replaceView('Actor', { id: actor._id }) }}>
                        <img src={store.lineLoader.getHostByType('image') + actor.avatar} style={{ width: 50 }} />
                        <div>{actor.name}</div>
                      </div>))}
                    </div>
                    <VisualBoxView visible={loader.item.videos.length > 1}>
                      <p
                        style={{
                          fontWeight: 'bolder',
                          margin: 0,
                          padding: '5px 0',
                        }}
                      >
                        播放列表:
                      </p>
                      <div>
                        {loader.item.videos.map((child) => (
                          <EpTag
                            key={child.path}
                            onClick={() => {
                              if (localStorage.child_id !== child._id) {
                                localStore.child_id = child.id;
                                localStore.looktime = 0;
                                localStore.playpath =
                                  lineLoader.getHostByType('video') +
                                  child.path;
                                localStore.setRecorder(
                                  localStore.child_id,
                                  localStore.looktime,
                                );
                              }
                            }}
                            selected={localStore.child_id === child._id}
                          >
                            {child.title || `第${child.nth}集`}
                          </EpTag>
                        ))}
                      </div>
                    </VisualBoxView>
                    <p style={{ marginBottom: 8 }}>内容简介:</p>
                    <div
                      className='line2'
                      style={{ lineHeight: 1.5, color: '#555', textIndent: 20, wordBreak: 'break-all' }}
                      onClickCapture={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        e.currentTarget.className = e.currentTarget.className === '' ? 'line2' : '';
                      }}
                      dangerouslySetInnerHTML={{
                        __html: loader.item.desc || '暂无',
                      }}
                    ></div>
                    <div
                      className="dd-common-alignside"
                      style={{ margin: '5px 50px' }}
                    >
                      <MIconView
                        type="FaHeart"
                        style={{
                          color: loader.item.marked ? '#e54e36' : '#848484',
                        }}
                        onClick={() => {
                          if (!store.app.isLogin) {
                            return showTip(router)
                          }
                          loader.item.setMarked(!loader.item.marked);
                        }}
                      />
                    </div>
                    <VisualBoxView visible={loader.item.tags.length > 0}>
                      <p style={{ margin: '5px 0' }}>标签:</p>
                      <div>
                        {loader.item.tags.map((tag) => (
                          <EpTag
                            key={tag}
                            selected={false}
                            onClick={(e) => {
                              router.pushView('Search', { tag });
                            }}
                          >
                            {tag}
                          </EpTag>
                        ))}
                      </div>
                    </VisualBoxView>
                  </div>
                  <div>
                    <p style={{ marginLeft: 10, fontSize: '1.2rem' }}>
                      相关推荐
                      <MdRefresh onClick={() => {
                        recommendsLoader.refresh({ query: localStore.query })
                      }} />
                    </p>
                    {recommendsLoader.items.map((item) => (
                      <div key={item.id} style={{ margin: 10 }}>
                        <ResourceItem
                          item={item}
                          onClick={(it) => {
                            router.replaceView('VideoInfo', { id: it._id });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ height: 'env(safe-area-inset-bottom)' }}></div>
                </div>
              </UserAreaView>
            </Fragment>
          );
        }
      }}
    </Observer>
  );
}

export default {
  group: {
    view: 'VideoInfo',
  },
  model,
  View,
};
