import React, { useCallback, useRef } from 'react'
import { Observer } from 'mobx-react-lite'
import { PullToRefresh } from 'antd-mobile'

function isInViewPort(el) {
  if (!el) {
    return false;
  }
  const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  const top = el.getBoundingClientRect() && el.getBoundingClientRect().top
  return top <= viewPortHeight - 10
}

function RefreshAndLoadMore({ isLoading, isEnded, isEmpty, refresh, loadMore, children }) {
  const eleRef = useRef(null);
  const onLoadMore = useCallback(async () => {
    if (isLoading || isEnded) {
      return;
    }
    loadMore();
  })
  return <Observer>{() => (
    <div className='full-height-auto' style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <PullToRefresh
        style={{ flex: 1, overflow: 'auto' }}
        onScroll={() => {
          const isReachBottom = isInViewPort(eleRef.current);
          if (isReachBottom) {
            onLoadMore()
          }
        }}
        onRefresh={refresh}
      >
        {children}
        <div ref={ref => eleRef.current = ref} style={{ textAlign: 'center', padding: 15, paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {isLoading && !isEmpty && '正在加载...'}
          {!isLoading && isEnded && '加载完毕'}
          {!isLoading && !isEnded && <span onClick={() => onLoadMore()}>点击加载更多</span>}
        </div>
      </PullToRefresh>
    </div>
  )}</Observer>
}

export default RefreshAndLoadMore;
