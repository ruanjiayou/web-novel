import React, { useEffect, useCallback, useRef } from 'react';
import { useEffectOnce, useMount } from 'react-use';
import { Observer, useLocalStore } from 'mobx-react-lite';
import FilterRow from '../FitlerRow';
import { LoaderListView, MIconView, PullRefreshLoadMore } from 'components';
import ResourceItem from 'business/ResourceItem';
import { useStoreContext } from 'contexts';
import ResourceListLoader from 'loader/ResourceListLoader';
import { PullToRefresh } from 'antd-mobile';

const statusRecord = {
  pulling: '用力拉',
  canRelease: '松开吧',
  refreshing: '玩命加载中...',
  complete: '好啦',
};

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

function throttleDelayExecution(fn, delay) {
  let last = Date.now(); // 使用时间戳实现
  return function () {
    let now = Date.now();
    if (now - last >= delay) {
      fn.apply(this, arguments);
      last = now;
    }
  };
}

export default function Filter({ self, loader, ...props }) {
  const store = useStoreContext();
  const eleRef = useRef(null);
  const lstore = useLocalStore(() => ({
    loader:
      store.resourceListLoaders[loader.item.id] || ResourceListLoader.create(),
    filterHeight: 0,
    showShort: false,
    query: {},
  }));
  if (store.resourceListLoaders[loader.item.id]) {
    store.resourceListLoaders[loader.item.id] = lstore.loader;
  }
  const refresh = useCallback(async () => {
    lstore.query = loader.getQuery();
    lstore.loader.refresh({ query: lstore.query });
  });
  const loadMore = useCallback(async () => {
    lstore.query = loader.getQuery();
    lstore.loader.loadMore({ query: lstore.query });
  });
  useEffect(() => {
    if (lstore.loader.state === 'init') {
      refresh();
    }
  });
  return (
    <Observer>
      {() => (
        <div className="full-height" style={{ position: 'relative' }}>
          {lstore.showShort && (
            <div
              onClick={() => {
                lstore.showShort = false;
              }}
              style={{
                position: 'absolute',
                top: 0,
                width: '100%',
                zIndex: 2,
                fontWeight: 600,
                height: 32,
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid #ccc',
              }}
            >
              {self.selectedArr.join(' · ')}{' '}
              <MIconView
                type="FaAngleLeft"
                style={{ transform: 'rotate(-90deg)' }}
              />
            </div>
          )}
          <div
            className=""
            style={{ display: lstore.showShort ? 'none' : 'block' }}
            ref={(ref) => {
              if (ref) {
                lstore.filterHeight = Math.max(
                  ref.offsetHeight * 2,
                  lstore.filterHeight,
                );
              }
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {self.children.map((child) => (
              <FilterRow self={child} key={child.id} onQueryChange={refresh} />
            ))}
          </div>
          <PullToRefresh
            style={{ flex: 1, overflow: 'auto' }}
            onScroll={() => {
              const isReachBottom = isInViewPort(eleRef.current);
              if (!lstore.loader.isEnded && isReachBottom) {
                !lstore.loader.isLoading && loadMore();
              }
            }}
            onRefresh={refresh}
            // renderText={status => {
            //   return <div>{statusRecord[status]}</div>
            // }}
          >
            <LoaderListView
              loader={lstore.loader}
              loadMore={loadMore}
              onScroll={(e) => {
                if (
                  e.target.scrollTop > lstore.filterHeight * 2 &&
                  lstore.filterHeight !== 0
                ) {
                  lstore.showShort = true;
                } else {
                  lstore.showShort = false;
                }
              }}
              refresh={refresh}
              itemWrapStyle={{ margin: 10 }}
              renderItem={(item, selectionId, index) => (
                <ResourceItem
                  key={item.id}
                  item={item}
                  loader={lstore.loader}
                  selectionId={selectionId}
                />
              )}
            />
            <div
              ref={(ref) => (eleRef.current = ref)}
              style={{
                textAlign: 'center',
                padding: 15,
                paddingBottom: 'env(safe-area-inset-bottom)',
              }}
            >
              {lstore.loader.isLoading ? (
                '正在加载更多数据...'
              ) : lstore.loader.isEnded && !lstore.loader.isEmpty? (
                '已全部加载完毕'
              ) : (
                null
              )}
            </div>
          </PullToRefresh>
        </div>
      )}
    </Observer>
  );
}
