import React, { Fragment, useEffect, useCallback } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { ActivityIndicator, Icon, Button, Toast } from 'antd-mobile';

import timespan from 'utils/timespan';
import { ResourceLoader } from 'loader';
import {
  MIconView,
  AutoCenterView,
  VisualBoxView,
  EmptyView,
  UserAreaView,
} from 'components';
import createPageModel from 'page-group-loader-model/BasePageModel';
import Recorder from 'utils/cache';
import { useEffectOnce } from 'react-use';

const bookRecorder = new Recorder('book');
const model = createPageModel({
  ResourceLoader,
});

function View({ self, router, store, services, params }) {
  const loader = self.ResourceLoader;
  const localStore = useLocalStore(() => ({
    loading: false,
    firstLoading: false,
    shouldFix: false,
    cached: false,
    _id: params.id,
  }));
  const toogleCache = useCallback(async () => {
    if (loader.isEmpty) {
      return Toast.info('加载中...');
    }
    if (localStore.cached) {
      bookRecorder.removeKey(params.id);
    } else {
      const info = await services.getBookFirstChapter({
        params: { _id: localStore._id },
      });
      if (info) {
        bookRecorder.setValue(params.id, loader.item.toJSON(), {
          _id: info.item._id,
          title: info.item.title,
        });
      } else {
        return Toast.info('添加失败');
      }
    }
    localStore.cached = !localStore.cached;
  });
  useEffectOnce(() => {
    bookRecorder.getValue(params.id).then((result) => {
      if (result) {
        localStore.cached = true;
      }
    });
    return () => {
      loader.clear();
    };
  });
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh({ params: { _id: localStore._id } });
    }
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
              <UserAreaView top="0">
                <div
                  className="dd-common-alignside"
                  style={{
                    position: 'absolute',
                    width: '100%',
                    boxSizing: 'border-box',
                    height: 45,
                    marginTop: 'env(safe-area-inset-top)',
                    padding: '0 15px',
                    zIndex: 1,
                  }}
                >
                  <MIconView
                    type="FaChevronLeft"
                    color="white"
                    onClick={() => {
                      router.back();
                    }}
                  />
                  <div>
                    <div>{loader.item.title}</div>
                    <div>
                      {loader.item.uname} · {loader.item.type}
                    </div>
                  </div>
                  <MIconView type="FaEllipsisH" color="white" />
                </div>
                <div className="full-height-auto">
                  <div
                    style={{
                      position: 'relative',
                      padding: '20px 0 10px 0',
                      paddingTop: 'env(safe-area-inset-top)',
                      textAlign: 'center',
                      backgroundColor: '#bfbaba',
                      color: 'white',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={loader.item.auto_cover}
                      alt=""
                      style={{
                        width: '100%',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        filter: 'blur(8px)',
                      }}
                    />
                    <img
                      src={loader.item.auto_cover}
                      alt=""
                      width={100}
                      height={120}
                      style={{ marginTop: 50, position: 'relative' }}
                    />
                    <div style={{ fontSize: 20, padding: 5 }}>
                      {loader.item.title}
                    </div>
                    <div>
                      {loader.item.uname} · {loader.item.type}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '0 20px',
                      borderBottom: '1px solid #ccc',
                      backgroundColor: 'snow',
                    }}
                  >
                    <div className="dd-common-alignside" style={{ height: 50 }}>
                      <div className="dd-common-centerXY" style={{ flex: 1 }}>
                        {Math.round(loader.item.size / 10000)}万字
                      </div>
                      <div className="dd-common-centerXY" style={{ flex: 1 }}>
                        {loader.item.counter.chapters}章
                      </div>
                      <div className="dd-common-centerXY" style={{ flex: 1 }}>
                        {loader.item.counter.comments}评论
                      </div>
                    </div>
                    <div className="dd-common-alignside">
                      <Button
                        type="primary"
                        size="small"
                        loading={localStore.firstLoading}
                        onClick={async () => {
                          try {
                            localStore.firstLoading = true;
                            const info = await services.getBookFirstChapter({
                              params: { _id: localStore._id },
                            });
                            router.pushView(`BookChapter`, {
                              mid: localStore._id,
                              id: info.item._id,
                            });
                          } catch (err) {
                          } finally {
                            localStore.firstLoading = false;
                          }
                        }}
                      >
                        立即阅读
                      </Button>
                      <Button
                        type={localStore.cached ? 'ghost' : 'primary'}
                        size="small"
                        onClick={toogleCache}
                      >
                        {localStore.cached ? '移出书架' : '加入书架'}
                      </Button>
                      <Button
                        type="ghost"
                        size="small"
                        style={{ minWidth: 82 }}
                        onClick={() => {
                          window.open(
                            `${store.app.baseURL}/v1/public/download/book/${localStore._id}`,
                            '_blank',
                          );
                        }}
                      >
                        下载
                      </Button>
                      <MIconView
                        type="FaHeart"
                        style={{
                          color: loader.item.marked ? '#e54e36' : '#848484',
                        }}
                        onClick={() => {
                          loader.item.setMarked(!loader.item.marked);
                        }}
                      />
                    </div>
                    <p style={{ marginBottom: 8 }}>内容简介:</p>
                    <div
                      style={{
                        lineHeight: 1.5,
                        color: '#555',
                        textIndent: 20,
                        borderBottom: '1px solid #ccc',
                        minHeight: 120,
                      }}
                      dangerouslySetInnerHTML={{ __html: loader.item.desc }}
                    ></div>
                    <div
                      className="full-width"
                      style={{ height: 40 }}
                      onClick={() => {
                        router.pushView(`BookCatalog`, { id: localStore._id });
                      }}
                    >
                      <span
                        className="full-width-auto"
                        style={{ fontWeight: 'bolder' }}
                      >
                        目录
                      </span>
                      <span className="full-width-fix">
                        连载至 {loader.item.counter.chapters}章
                        {timespan(
                          new Date(loader.item.last.createdAt || Date.now()),
                        )}
                        更新
                      </span>
                      <MIconView
                        style={{ marginLeft: 10 }}
                        className="full-width-fix"
                        type="FaAngleRight"
                      />
                    </div>
                  </div>
                  <p>TODO:作者 名称 头像 几部作品</p>
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
    view: 'BookInfo',
  },
  model,
  View,
};
