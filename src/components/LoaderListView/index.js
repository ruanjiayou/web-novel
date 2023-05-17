import React, { Fragment, useEffect } from 'react'
import { Observer } from 'mobx-react-lite'
import { PullToRefresh, List, } from 'antd-mobile'

const GetPullToRefreshlData = ({ refresh, loader, renderItem, loadMore }) => {
  useEffect(() => {
    refresh()
  }, []);

  return (
    <Observer>{() => (
      <div style={{ height: '100%', overflowY: 'scroll' }} onScroll={e => {
        const offset = e.currentTarget.scrollHeight - e.currentTarget.offsetHeight - e.currentTarget.scrollTop
        if (offset === 0 && !loader.isLoading) {
          loadMore ? loadMore() : loader.loadMore();
        }
      }}>
        <PullToRefresh
          onRefresh={refresh}
        >
          <List>
            {loader.items.map((item, index) => <div key={index}>{renderItem(item, loader.name, index)}</div>)}
          </List>
          <div style={{ textAlign: 'center', padding: 5 }}>{loader.isLoading ? '正在加载更多数据...' : '已全部加载完毕'}</div>
        </PullToRefresh>
      </div>
    )}</Observer>
  );
};

export default GetPullToRefreshlData;
