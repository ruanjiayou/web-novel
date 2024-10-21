import React, { Fragment, useCallback, useRef, useEffect } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { ActivityIndicator, Tabs } from 'antd-mobile';
import { SearchLoader } from 'loader';
import renderBlank from 'components/EmptyView';
import { LoaderListView, MIconView, UserAreaView } from 'components';
import ResourceItem from 'business/ResourceItem';
import { useEffectOnce } from 'react-use';
import createPageModel from 'page-group-loader-model/BasePageModel';
import {
  FullHeight,
  FullHeightFix,
  FullHeightAuto,
  FullWidth,
  FullWidthAuto,
  FullWidthFix,
} from 'components/common';
import { useNaviContext, useRouterContext } from 'contexts';
import storage from 'utils/storage';

const model = createPageModel({
  allLoader: SearchLoader,
  videosLoader: SearchLoader,
  moviesLoader: SearchLoader,
  shortsLoader: SearchLoader,
  imagesLoader: SearchLoader,
  imagesLoader: SearchLoader,
  comicsLoader: SearchLoader,
  articlesLoader: SearchLoader,
  novelsLoader: SearchLoader,
  musicsLoader: SearchLoader,
  postsLoader: SearchLoader,
});

const tabs = [
  { title: '全部', type: '', loader: 'allLoader' },
  { title: '视频', type: 'video', loader: 'videosLoader' },
  { title: '电影', type: 'movie', loader: 'moviesLoader' },
  { title: '短视频', type: 'short', loader: 'shortsLoader' },
  { title: '图片', type: 'image', loader: 'imagesLoader' },
  { title: '漫画', type: 'comic', loader: 'comicsLoader' },
  { title: '小说', type: 'novel', loader: 'novelsLoader' },
  { title: '文章', type: 'article', loader: 'articlesLoader' },
  { title: '音乐', type: 'music', loader: 'musicsLoader' },
  { title: '帖子', type: 'post', loader: 'postsLoader' },
];

function View({ self, params }) {
  const router = useRouterContext();
  const loader = self.allLoader;
  const iRef = useRef(null);
  const local = useLocalStore(() => ({
    search: params.title || '',
    tag: params.tag || '',
  }));
  useEffectOnce(() => {
    tabs.forEach(tab => {
      self[tab.loader].setOption({ query: { type: tab.type } });
    })
    // loader.setOption({ query: { q: params.title, tag: local.tag } });
    loader.refresh({
      query: { key: 'q', value: local.search, tag: local.tag },
    });
  }, []);
  const onChange = useCallback((tab, index) => {
    if (self[tab.loader].isEmpty) {
      self[tab.loader].refresh({
        query: { key: 'q', value: local.search, tag: local.tag },
      });
    }
  });
  return (
    <Observer>
      {() => (
        <UserAreaView bottom='0'>
          <FullWidth style={{ height: 50, marginLeft: 10 }}>
            <FullWidthFix>
              <MIconView
                type="FaAngleLeft"
                style={{}}
                onClick={() => router.back()}
              />
            </FullWidthFix>
            <FullWidthAuto
              style={{
                marginLeft: 10,
                position: 'relative',
                display: 'flex',
                backgroundColor: '#ccc',
                alignItems: 'center',
                border: '0 none',
                width: '100%',
                borderRadius: 5,
                padding: '5px 8px',
              }}
            >
              {local.tag && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 20,
                    borderRadius: 10,
                    padding: '0 5px',
                    border: '1px solid #999',
                  }}
                >
                  {local.tag}
                  <MIconView
                    type="IoIosClose"
                    onClick={(e) => {
                      local.tag = '';
                      iRef.current && iRef.current.focus();
                    }}
                  />
                </div>
              )}
              <input
                defaultValue={params.title}
                autoFocus={false}
                ref={(ref) => {
                  iRef.current = ref;
                }}
                style={{
                  backgroundColor: '#ccc',
                  height: 30,
                  marginLeft: 10,
                  flex: 1,
                  boxSizing: 'border-box',
                  border: '0 none',
                }}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    const str = iRef.current ? iRef.current.value : '';
                    if (str) {
                      storage.setValue(
                        'historyWords',
                        (storage.getValue('historyWords') || '')
                          .split(',')
                          .filter((s) => s !== '')
                          .join(','),
                      );
                    }
                    local.search = str;
                    loader.refresh({
                      query: { key: 'q', value: local.search, tag: local.tag },
                    });
                  }
                }}
              />
            </FullWidthAuto>
            <div
              style={{ color: '#ccc', margin: '0 5px' }}
              onClick={() => {
                if (loader.isLoading) {
                  return;
                }
                loader.refresh({
                  query: { key: 'q', value: local.search, tag: local.tag },
                });
              }}
            >
              {loader.isLoading ? <ActivityIndicator /> : "搜索"}
            </div>
          </FullWidth>
          <FullHeightAuto>
            <Tabs
              tabs={tabs}
              initialPage={'all'}
              animated={true}
              onChange={onChange}
            >
              {tabs.map(tab => (
                <LoaderListView
                  auto={false}
                  loader={self[tab.loader]}
                  style={{ height: '100%' }}
                  itemWrapStyle={{ margin: 10 }}
                  key={tab.type}
                  renderItem={(item, selectionId, index) => (
                    <ResourceItem
                      key={index}
                      item={item}
                      loader={self[tab.loader]}
                      selectionId={selectionId}
                    />
                  )}
                >
                  <div
                    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
                  ></div>
                </LoaderListView>
              ))}
            </Tabs>
            {/* TODO: loading */}
            {/* <LoaderListView
              loader={loader}
              auto={false}
              itemWrapStyle={{ margin: 10 }}
              renderItem={(item) => (
                <ResourceItem key={item.id} item={item} loader={loader} />
              )}
            >
              <div style={{ height: 'env(safe-area-inset-bottom)' }}></div>
            </LoaderListView> */}
          </FullHeightAuto>
        </UserAreaView>
      )}
    </Observer>
  );
}

export default {
  group: {
    view: 'SearchResult',
  },
  View,
  model,
};
