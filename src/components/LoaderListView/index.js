import React, { Fragment, useEffect } from 'react'
import { Observer } from 'mobx-react-lite'
// import { PullToRefresh, List, } from 'antd-mobile'
import PullToRefresh from 'react-simple-pull-to-refresh';

const GetPullToRefreshlData = ({ refresh, loader, renderItem, loadMore }) => {
  useEffect(() => {
    refresh ? refresh() : loader.refresh();
  }, []);

  return (
    <Observer>{() => (
      <div style={{ height: '100%', overflowY: 'scroll' }} onScroll={e => {
        const offset = e.currentTarget.scrollHeight - e.currentTarget.offsetHeight - e.currentTarget.scrollTop
        if (offset <= 10 && !loader.isLoading) {
          loadMore ? loadMore() : loader.loadMore();
        }
      }}>
        <PullToRefresh
          onRefresh={async () => { refresh ? refresh() : loader.refresh() }}
          canFetchMore={false}
          fetchMoreThreshold={100}
          pullDownThreshold={67}
          maxPullDownDistance={95}
          resistance={1}
        >
          {loader.items.map((item, index) => <div key={index}>{renderItem(item, loader.name, index)}</div>)}
          <div style={{ textAlign: 'center', padding: 5 }}>{loader.isLoading ? '正在加载更多数据...' : '已全部加载完毕'}</div>
        </PullToRefresh>
      </div>
    )}</Observer>
  );
};

export default GetPullToRefreshlData;
