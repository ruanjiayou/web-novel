import React, { useEffect } from 'react';
import { useEffectOnce } from 'react-use';
import { Observer, useLocalStore } from 'mobx-react-lite';
// import { Tabs } from 'antd-mobile'

import { RenderGroups } from 'group';
import { MIconView, Tabs } from 'components';
import {
  FullHeight,
  FullWidth,
  FullHeightAuto,
  FullHeightFix,
} from 'components/common';
import { channelLoaders } from 'store';
import createPageModel from 'page-group-loader-model/BasePageModel';
import showTip from 'utils/showTip';

const model = createPageModel({});

function View({ self, router, store, params }) {
  const channels = store.app.channels;
  const loaders = channelLoaders;
  const local = useLocalStore(() => ({
    index: channels.findIndex((ch) => ch.group_id === params.tab) || 0,
  }));
  useEffectOnce(() => {
    if (params.tab) {
      store.app.setTab(params.tab);
    }
    if (!store.app.tab) {
      store.app.setTab(channels.length ? channels[0].group_id : '');
    }
  });
  return (
    <Observer>
      {() => (
        <FullHeight>
          <FullHeightFix>
            <FullWidth
              style={{
                height: 50,
                paddingLeft: 'env(safe-area-inset-left)',
                paddingRight: 'env(safe-area-inset-right)',
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              <img
                src="/novel/logo.jpg"
                alt=""
                style={{ margin: '0 10px', borderRadius: '50%' }}
                onClick={(e) => {
                  router.replaceView('mine');
                }}
              />
              <FullHeightAuto
                style={{ height: 30, backgroundColor: '#ccc', borderRadius: 5 }}
                onClick={() => {
                  router.pushView('Search');
                }}
              />
              <div
                style={{ margin: 5 }}
                onClick={() => {
                  if (store.app.isLogin) {
                    router.pushView('Record');
                  } else {
                    showTip(router);
                  }
                }}
              >
                <MIconView type="FaHistory" style={{ color: '#14b2f7' }} />
              </div>
              <div
                style={{ marginRight: 5 }}
                onClick={() => {
                  if (store.app.isLogin) {
                    router.pushView('Marked');
                  } else {
                    showTip(router);
                  }
                }}
              >
                <MIconView
                  type="FaStar"
                  size={'md'}
                  style={{ color: '#f97a90' }}
                />
              </div>
            </FullWidth>
          </FullHeightFix>
          <FullHeightAuto
            style={{
              paddingLeft: 'env(safe-area-inset-left)',
              paddingRight: 'env(safe-area-inset-right)',
            }}
          >
            <Tabs
              tabs={channels}
              align='center'
              defaultIndex={local.index}
              onChange={(tab, index) => {
                store.app.setTab(tab.group_id);
                router.replaceView('home', { tab: tab.group_id });
              }}
            >
              {channels.map((channel, index) => (
                <RenderGroups
                  key={index}
                  loader={loaders[channel.group_id]}
                  group={channel.data}
                />
              ))}
            </Tabs>
          </FullHeightAuto>
        </FullHeight>
      )}
    </Observer>
  );
}

export default {
  group: {
    view: 'home',
  },
  model,
  View,
};
