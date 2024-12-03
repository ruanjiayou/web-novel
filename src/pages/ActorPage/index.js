import React, { Fragment, useEffect, useCallback } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { FullHeight, FullHeightAuto, FullHeightFix } from 'components/common';
import createPageModel from 'page-group-loader-model/BasePageModel';
import { useEffectOnce } from 'react-use';
import services from 'services';
import { ActorVideoLoader } from 'loader'
import { LoaderListView, UserAreaView } from 'components';
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
          auto={false}
          renderItem={(item, sectionId, index) => (
            <ResourceItem
              key={index}
              item={item}
              router={router}
              sectionId={sectionId}
            />
          )}
        />
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
