import React, { Fragment, useEffect, useRef } from 'react'
import { Observer } from 'mobx-react-lite'
import { PullToRefresh, List, } from 'antd-mobile'

const GetPullToRefreshlData = ({ refresh, loadMore, loader, renderItem }) => {
  useEffect(() => {
    refresh ? refresh() : loader.refresh();
  }, []);
  const nodeRef = useRef(null)
  return (
    <Observer>{() => (
      <div style={{ height: '100%', overflowY: 'scroll' }} ref={node => {
        if (node) {
          nodeRef.current = node;
          nodeRef.current.addEventListener('scroll', () => {
            if (nodeRef.current.scrollHeight - nodeRef.current.scrollTop - nodeRef.current.offsetHeight <= 1 && !loader.isLoading && !loader.isEnded) {
              loadMore ? loadMore(): loader.loadMore();
            }
          })
        }
      }}>
        <PullToRefresh
          onRefresh={refresh}
        >
          <List>
            {loader.items.map((item, index) => <div key={index}>{renderItem(item, loader.name, index)}</div>)}
          </List>
          <div style={{ textAlign: 'center', padding: 5 }}>{loader.isLoading ? '正在加载更多数据...' : loader.isEnded ? '已全部加载完毕' : <span onClick={loadMore}>点击加载更多</span>}</div>
        </PullToRefresh>
      </div>
    )}</Observer>
  );
};

export default GetPullToRefreshlData;
