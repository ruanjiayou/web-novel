import React from 'react';
import { Observer } from 'mobx-react-lite';
import { ActivityIndicator } from 'antd-mobile';

const style = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'black'
};

export default function ({ loader, renderBlank, render }) {
  return (
    <Observer>
      {() => {
        if (loader.isEmpty) {
          if (renderBlank) {
            return renderBlank(loader);
          }
          if (loader.isError) {
            return (
              <div style={style}>
                出错啦!
                {loader.error && loader.error.message}
                <span
                  onClick={() => {
                    loader.refresh();
                  }}
                >
                  点我重试
                </span>
              </div>
            );
          } else {
            return (
              <div style={style}>
                <ActivityIndicator text="加载中..." />
              </div>
            );
          }
        } else {
          return render();
        }
      }}
    </Observer>
  );
}
