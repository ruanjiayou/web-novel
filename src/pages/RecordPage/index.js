import React, { Fragment, useRef, useEffect } from 'react'
import { useEffectOnce } from 'react-use'
import { SwipeAction } from 'antd-mobile'
import { Observer, useLocalStore } from 'mobx-react-lite'

import ResourceItem from 'business/ResourceItem'
import { LoaderListView, AutoCenterView, UserAreaView } from 'components'
import { PullToRefresh } from 'antd-mobile'

import ResourceModel from 'models/ResourceModel'
import createPageModel from 'page-group-loader-model/BasePageModel'
import { HistoryListLoader } from 'loader'
import services from 'services'

const model = createPageModel({
  historyListLoader: HistoryListLoader
})

function isInViewPort(el) {
  if (!el) {
    return false;
  }
  const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  const top = el.getBoundingClientRect() && el.getBoundingClientRect().top
  return top <= viewPortHeight - 10
}

function View({ self, router, store, Navi, params }) {
  const loader = self.historyListLoader;
  const eleRef = useRef(null);
  useEffect(() => {
    if (loader.state === 'init') {
      loader.refresh()
    }
  })
  useEffectOnce(() => {
    if (loader.isEmpty) {
      loader.refresh({ params: { id: params.id } })
    }
  })
  return <Observer>{
    () => {
      return <UserAreaView>
        <Navi title="记录" />

        <PullToRefresh
          style={{ flex: 1, overflow: 'auto' }}
          onScroll={() => {
            const isReachBottom = isInViewPort(eleRef.current);
            if (!loader.isEnded && isReachBottom) {
              !loader.isLoading && loader.loadMore()
            }
          }}
          onRefresh={loader.refresh}
        >
          <LoaderListView
            loader={loader}
            renderEmpty={(
              <AutoCenterView>
                <span>没有阅读记录</span>
              </AutoCenterView>
            )}
            itemWrapStyle={{ margin: 10 }}
            renderItem={(item, sectionId, index) => (
              <SwipeAction
                key={item.id}
                right={[{
                  text: '删除',
                  onPress: (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    services.destroyHistory({ params: { id: item.resource_id } });
                    loader.remove(index);
                  },
                  style: { backgroundColor: 'red', color: 'white' }
                }]}
              >
                <ResourceItem
                  item={item.detail}
                  router={router}
                  sectionId={sectionId}
                />
              </SwipeAction>
            )}
          />
          <div ref={ref => eleRef.current = ref} style={{ textAlign: 'center', padding: 15 }}>{loader.isLoading ? '正在加载更多数据...' : (loader.isEnded ? '已全部加载完毕' : <span>点击加载更多</span>)}</div>
        </PullToRefresh>

      </UserAreaView>
    }
  }</Observer>
}

export default {
  group: {
    view: 'Record',
  },
  View,
  model,
}