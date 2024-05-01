import React, { Fragment, useRef, useEffect, useCallback } from 'react';
import { useEffectOnce } from 'react-use';
import { SwipeAction } from 'antd-mobile';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { Tabs } from 'antd-mobile';

import ResourceItem from 'business/ResourceItem';
import { LoaderListView, AutoCenterView, UserAreaView, VisualBoxView } from 'components';
import { PullToRefresh } from 'antd-mobile';

import ResourceModel from 'models/ResourceModel';
import createPageModel from 'page-group-loader-model/BasePageModel';
import { HistoryListLoader } from 'loader';
import services from 'services';
import HistoryVideoItem from 'business/ResourceItem/VideoItem/HistoryVideoItem.js';
import { FullHeightAuto } from 'components/common';

const model = createPageModel({
  historyListLoader: HistoryListLoader,
  all: HistoryListLoader,
  videos: HistoryListLoader,
  images: HistoryListLoader,
  articles: HistoryListLoader,
  novels: HistoryListLoader,
});
const tabs = [
  { title: '全部', type: '', loader: 'all' },
  { title: '视频', type: 'video', loader: 'videos' },
  { title: '图片', type: 'image', loader: 'images' },
  { title: '文章', type: 'article', loader: 'articles' },
  { title: '小说', type: 'novel', loader: 'novels' },
];

function isInViewPort(el) {
  if (!el) {
    return false;
  }
  const viewPortHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  const top = el.getBoundingClientRect() && el.getBoundingClientRect().top;
  return top <= viewPortHeight - 10;
}

function View({ self, router, store, Navi, params }) {
  const eleRef = useRef(null);
  useEffectOnce(() => {
    self.videos.setOption({ query: { type: 'video' } })
    self.images.setOption({ query: { type: 'image' } })
    self.articles.setOption({ query: { type: 'article' } })
    self.novels.setOption({ query: { type: 'novel' } })
    if (self.all.isEmpty) {
      self.all.refresh({});
    }
  });
  const onChange = useCallback((tab, index) => {
    if (self[tab.loader].isEmpty) {
      self[tab.loader].refresh();
    }
  });
  return (
    <Observer>
      {() => {
        return (
          <UserAreaView bottom="0" bgcBot={'transparent'}>
            <Navi title="记录" />
            <FullHeightAuto>
              <Tabs
                tabs={tabs}
                initialPage={'all'}
                onChange={onChange}
                animated
              >
                {tabs.map((tab) => {
                  const loader = self[tab.loader]
                  return <PullToRefresh
                    style={{ flex: 1, overflow: 'auto' }}
                    onScroll={() => {
                      const isReachBottom = isInViewPort(eleRef.current);
                      if (!loader.isEnded && isReachBottom) {
                        !loader.isLoading && loader.loadMore();
                      }
                    }}
                    onRefresh={loader.refresh}
                  >
                    <LoaderListView
                      loader={loader}
                      renderEmpty={
                        <AutoCenterView>
                          <span>没有阅读记录</span>
                        </AutoCenterView>
                      }
                      itemWrapStyle={{ margin: 10 }}
                      renderItem={(item, sectionId, index) => (
                        <SwipeAction
                          key={item.resource_id}
                          right={[
                            {
                              text: '删除',
                              onPress: (e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                services.destroyHistory({
                                  params: { id: item.resource_id },
                                });
                                loader.remove(index);
                              },
                              style: { backgroundColor: 'red', color: 'white' },
                            },
                          ]}
                        >
                          {['video', 'movie', 'animation'].includes(
                            item.resource_type,
                          ) ? (
                            <HistoryVideoItem
                              item={item.detail}
                              created_at={item.created_at}
                              watched={item.watched}
                              device={item.device}
                              router={router}
                            />
                          ) : (
                            <ResourceItem
                              item={item.detail}
                              router={router}
                              sectionId={sectionId}
                            />
                          )}
                        </SwipeAction>
                      )}
                    />
                    <div
                      ref={(ref) => (eleRef.current = ref)}
                      style={{ textAlign: 'center', padding: 15 }}
                    >
                      {loader.isLoading ? (
                        '正在加载更多数据...'
                      ) : loader.isEnded ? (
                        <VisualBoxView visible={!loader.isEmpty}>
                          已全部加载完毕
                        </VisualBoxView>
                      ) : (
                        <VisualBoxView visible={!loader.isEmpty}>
                          <span>点击加载更多</span>
                        </VisualBoxView>
                      )}
                    </div>
                    <div style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}></div>
                  </PullToRefresh>
                })}
              </Tabs>
            </FullHeightAuto>

          </UserAreaView>
        );
      }}
    </Observer>
  );
}

export default {
  group: {
    view: 'Record',
  },
  View,
  model,
};
