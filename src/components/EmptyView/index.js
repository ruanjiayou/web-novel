import React from 'react';
import { ActivityIndicator } from 'antd-mobile';

const style = {
  display: 'flex',
  minHeight: '50vh',
  alignItems: 'center',
  justifyContent: 'center',
};

export default function renderBlank(loader, renderEmpty, refresh) {
  if (loader.isEmpty || loader.isError) {
    if (loader.state === 'pending') {
      return (
        <div style={style}>
          <ActivityIndicator text="加载中..." />
        </div>
      );
    } else if (loader.error) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignitems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          出错啦!
          <div className="txt-omit">{loader.error.message}</div>
          <span onClick={() => (refresh ? refresh() : loader.refresh())}>
            重新加载
          </span>
        </div>
      );
    } else if (renderEmpty) {
      return typeof renderEmpty === 'function'
        ? renderEmpty(loader)
        : renderEmpty;
    } else {
      return (
        <div style={style}>
          没有数据,
          <span onClick={() => (refresh ? refresh() : loader.refresh())}>
            重新加载
          </span>
        </div>
      );
    }
  }
}
