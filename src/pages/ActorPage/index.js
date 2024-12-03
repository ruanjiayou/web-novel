import React, { useRef } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { FullHeightAuto, FullHeightFix } from 'components/common';
import createPageModel from 'page-group-loader-model/BasePageModel';
import { useEffectOnce } from 'react-use';
import { ActorVideoLoader } from 'loader'
import { LoaderListView, UserAreaView, VisualBoxView } from 'components';
import ResourceItem from 'business/ResourceItem';

const model = createPageModel({
  ActorVideoLoader
});

function View({ self, router, store, params, Navi }) {
  const loader = self.ActorVideoLoader;
  loader.setOption({ params })
  const local = useLocalStore(() => ({
    loading: false,
    actor: { _id: '', nickname: '', avatar: '' },
    resources: [],
    _id: params.id,
    page: 1,
  }));
  const eleRef = useRef(null);
  useEffectOnce(() => {
    local.loading = true;
    const option = { query: { page: local.page }, params };
    loader.refresh(option).then(resp => {
      local.actor = resp.user;
    })
  })
  return <Observer>{() => (
    <UserAreaView>
      <Navi title="个人主页" />
      <FullHeightFix>
        <img src={store.lineLoader.getHostByType('image') + local.actor.avatar} style={{ width: 50, marginTop: 10, marginLeft: 10 }} />
        <p>{local.actor.nickname}</p>
      </FullHeightFix>
      <FullHeightAuto>
        <LoaderListView
          loader={loader}
          loadMore={() => {
            loader.loadMore({ query: { page: local.page }, params })
          }}
          auto={false}
          style={{ height: '100%' }}
          renderItem={(item, sectionId, index) => (
            <ResourceItem
              key={index}
              item={item}
              router={router}
              sectionId={sectionId}
            />
          )}
        >
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
        </LoaderListView>
      </FullHeightAuto>
    </UserAreaView>
  )}</Observer>
}

export default {
  group: {
    view: 'Actor',
  },
  model,
  View,
};
