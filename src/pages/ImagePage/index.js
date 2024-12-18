import React, { Fragment, useEffect, useCallback } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { ActivityIndicator } from 'antd-mobile';

import { ResourceLoader } from 'loader';
import { AutoCenterView, MIconView, UserAreaView } from 'components';
import createPageModel from 'page-group-loader-model/BasePageModel';
import { ITag, Container } from './style';
import services from 'services';
import PinchZoom from 'components/PinchZoom/self';
import { IoIosShareAlt } from 'react-icons/io';

const { createMark, getMark, destroyMark } = services;
const model = createPageModel({
  ResourceLoader,
});
const RATIO = document.body.clientWidth / document.body.clientHeight;
function View({ self, router, store, params, Navi }) {
  const loader = self.ResourceLoader;
  let imageHost = store.lineLoader.getHostByType('image');
  const localStore = useLocalStore(() => ({
    loading: false,
    _id: params.id,
    markStatus: 'dislike', // like/error
    markLoading: false,
    markError: false,
    full: false,
    filepath: '',
    initW: 1,
    initH: 1,
  }));
  const MStatus = function () {
    if (localStore.markLoading) {
      return <ActivityIndicator animating={true} />;
    } else if (localStore.markError) {
      return <MIconView type="FaSyncAlt" />;
    } else if (localStore.markStatus === 'dislike') {
      return <MIconView type="FaHeart" style={{ color: 'white' }} />;
    } else {
      return <MIconView type="FaHeart" style={{ color: '#fb8e8e' }} />;
    }
  };
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh({ params: { _id: localStore._id } });
    }
    if (store.app.isLogin) {
      getMark({ params }).then((result) => {
        if (result.status === 'success') {
          localStore.markStatus = 'like';
        }
      });
    }
    return () => {
      loader.clear();
    }
  }, [localStore._id]);
  return (
    <Observer>
      {() => (
        <UserAreaView bgcTop={'pink'}>
          <div className="full-height">
            <Navi
              wrapStyle={{ backgroundColor: 'pink' }}
              title={
                loader.item
                  ? loader.item.title + ' ' + loader.item.uname
                  : '加载中...'
              }
            >
              <div style={{ marginRight: 10 }}>
                <IoIosShareAlt size={24} />
              </div>
            </Navi>
            <div className="full-height-auto">
              {loader.isEmpty ? (
                <AutoCenterView>
                  <ActivityIndicator text="加载中..." />
                </AutoCenterView>
              ) : (
                <Fragment>
                  {/* {loader.item.poster &&
                    loader.item.poster !== loader.item.images[0] && (
                      <img
                        src={imageHost + loader.item.poster}
                        style={{ maxWidth: '100%' }}
                      />
                    )} */}
                  {loader.item.images.map((image, index) => (
                    <img
                      key={index}
                      src={imageHost + image}
                      style={{ width: '100%' }}
                      onClick={(e) => {
                        const { width, height } = e.currentTarget || {};
                        const ratio = (width || 0) / (height || 1);
                        // 长图
                        localStore.initW =
                          RATIO > ratio
                            ? (width * document.body.clientHeight) / height
                            : document.body.clientWidth;
                        // 宽图
                        localStore.initH =
                          RATIO > ratio
                            ? document.body.clientHeight
                            : (height * document.body.clientWidth) / width;
                        localStore.filepath = imageHost + image;
                        localStore.full = true;
                      }}
                    />
                  ))}
                </Fragment>
              )}
            </div>
            <div
              style={{
                backgroundColor: '#ddd',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                position: 'fixed',
                right: 'calc(env(safe-area-inset-right) + 10px)',
                bottom: 'calc(env(safe-area-inset-bottom) + 60px)',
              }}
              onClick={async () => {
                if (localStore.markLoading) return;
                localStore.markLoading = true;
                try {
                  if (localStore.markStatus === 'dislike') {
                    await createMark({ data: params });
                    localStore.markStatus = 'like';
                  } else {
                    await destroyMark({ params });
                    localStore.markStatus = 'dislike';
                  }
                } catch (e) {
                  localStore.markError = true;
                } finally {
                  localStore.markLoading = false;
                }
              }}
            >
              {MStatus()}
            </div>
            <Container style={{ padding: 10 }}>
              {loader.item &&
                loader.item.tags.map((tag, index) => (
                  <ITag key={index} disabled>
                    {tag}
                  </ITag>
                ))}
            </Container>
            <PinchZoom
              visible={localStore.full}
              onTap={() => {
                console.log('close!');
                localStore.full = false;
              }}
              onDoubleTap={() => {
                console.log('double');
              }}
              src={localStore.filepath}
            />
          </div>
        </UserAreaView>
      )}
    </Observer>
  );
}

export default {
  group: {
    view: 'Image',
  },
  model,
  View,
};
