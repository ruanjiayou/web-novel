import React, { Fragment, useEffect, useRef } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { ActivityIndicator, Progress } from 'antd-mobile';

import { ResourceLoader } from 'loader';
import createPageModel from 'page-group-loader-model/BasePageModel';
import {
  EmptyView,
  AutoCenterView,
  VisualBoxView,
  MIconView,
  UserAreaView,
} from 'components';
import { FullWidth, FullHeightFix } from 'components/common';
import { useEffectOnce } from 'react-use';

const model = createPageModel({ ResourceLoader });

function View({ self, router, store, params = {} }) {
  const loader = self.ResourceLoader;
  const emptyView = EmptyView(loader);
  let imageHost = store.lineLoader.getHostByType('image');
  let videoHost = store.lineLoader.getHostByType('video');
  const localStore = useLocalStore(() => ({
    pop: false,
    percent: 0,
    _id: params.id,
  }));
  useEffectOnce(() => {
    loader.refresh({ params: { _id: localStore._id } });
    return () => {
      loader.clear();
    };
  });
  return (
    <Observer>
      {() => {
        return (
          <Fragment>
            {/* 内部文字 */}
            <UserAreaView bottom="0">
              <FullWidth
                className="full-height-fix"
                style={{
                  padding: '8px 0',
                  color: 'white',
                  backgroundColor: store.app.config.mainColor,
                }}
              >
                <FullHeightFix>
                  <MIconView
                    type="FaChevronLeft"
                    onClick={() => {
                      router.back();
                    }}
                  />
                </FullHeightFix>
                <FullHeightFix>
                  {loader.item ? loader.item.title : 'loading'}
                </FullHeightFix>
              </FullWidth>
              <VisualBoxView visible={loader.isEmpty}>
                <AutoCenterView>
                  <ActivityIndicator text="加载中..." />
                </AutoCenterView>
              </VisualBoxView>
              {!loader.isEmpty && (
                <Fragment>
                  <div
                    className="full-height-auto content"
                    style={{
                      width: '100%',
                      fontSize: 14,
                      boxSizing: 'border-box',
                      padding: '0 5px',
                      paddingBottom: 'env(safe-area-inset-bottom)',
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: loader.item.content,
                      }}
                    ></div>
                    {loader.item.images && loader.item.images.map((it, i) => (
                      <img key={i} src={imageHost + it} alt="t" />
                    ))}
                    {_.isArray(loader.item.videos) && loader.item.videos.map((it, i) => (
                      <video key={i} src={videoHost + it.path} controls style={{ width: '100%' }} />
                    ))}
                  </div>
                </Fragment>
              )}
            </UserAreaView>
          </Fragment>
        );
      }}
    </Observer>
  );
}

export default {
  model,
  View,
  group: {
    view: 'Post',
    attrs: {},
  },
};
