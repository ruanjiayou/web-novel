import React, { Fragment, useCallback } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { Tabs } from 'antd-mobile';
import { MarkListLoader } from 'loader';
import renderBlank from 'components/EmptyView';
import { LoaderListView, UserAreaView } from 'components';
import ResourceItem from 'business/ResourceItem';
import { useEffectOnce } from 'react-use';
import createPageModel from 'page-group-loader-model/BasePageModel';
import { FullHeight, FullHeightFix, FullHeightAuto } from 'components/common';
import { useNaviContext, useRouterContext } from 'contexts';

const model = createPageModel({
  videos: MarkListLoader,
  images: MarkListLoader,
  novels: MarkListLoader,
  articles: MarkListLoader,
  musics: MarkListLoader,
});
const tabs = [
  { title: '视频', type: 'video', loader: 'videos' },
  { title: '图片', type: 'image', loader: 'images' },
  { title: '文章', type: 'article', loader: 'articles' },
  { title: '小说', type: 'novel', loader: 'novels' },
  { title: '音乐', type: 'music', loader: 'musics' },
];

function View({ self }) {
  const Navi = useNaviContext();
  const router = useRouterContext();
  self.videos.setOption({ query: { type: 'video' } });
  self.images.setOption({ query: { type: 'image' } });
  useEffectOnce(() => {
    tabs.forEach((tab) => {
      self[tab.loader].setOption({ query: { type: tab.type } });
    });
    self.videos.refresh()
  });
  const onChange = useCallback((tab, index) => {
    if (self[tab.loader].isEmpty) {
      self[tab.loader].refresh();
    }
  });
  return (
    <UserAreaView bgcTop={'#f97a90'} bottom="0">
      <FullHeight>
        <Navi title="收藏" wrapStyle={{ backgroundColor: '#f97a90' }} />
        <FullHeightAuto>
          <Observer>
            {() => (
              <Tabs
                tabs={tabs}
                initialPage={'video'}
                onChange={onChange}
                animated={true}
              >
                {tabs.map((tab) => (
                  <LoaderListView
                    auto={false}
                    loader={self[tab.loader]}
                    style={{ height: '100%' }}
                    itemWrapStyle={{ margin: 10 }}
                    key={tab.type}
                    renderItem={(item, selectionId, index) => (
                      <ResourceItem
                        key={index}
                        item={item.detail}
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
            )}
          </Observer>
        </FullHeightAuto>
      </FullHeight>
    </UserAreaView>
  );
}

export default {
  group: {
    view: 'Marked',
  },
  View,
  model,
};
