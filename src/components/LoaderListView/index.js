import React, { useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import renderEmptyView from 'components/EmptyView'
import AutoCenterView from 'components/AutoCenterView'

const GetPullToRefreshlData = ({ refresh, loader, renderItem, loadMore, style, itemWrapStyle }) => {
  const emptyView = renderEmptyView(loader)
  useEffect(() => {
    if (loader.isEmpty) {
      refresh ? refresh() : loader.refresh();
    }
  }, []);
  const local = useLocalStore(() => ({
    touchedBottom: false,
    backedToTop: true,
    trigerTopLimit: false,
    showFinished: false,
    topHeight: 0,
  }))
  return (
    <Observer>{() => {
      if (loader.isEmpty && !loader.isLoading) {
        return <AutoCenterView>{emptyView}</AutoCenterView>
      } else {
        return <div style={{ overflowY: 'auto', position: 'relative', ...style }} onScroll={e => {
          const scrollTop = e.currentTarget.scrollTop;
          const offset = e.currentTarget.scrollHeight - e.currentTarget.offsetHeight - scrollTop
          if (scrollTop < 0 && local.backedToTop && !local.showFinished) {
            local.topHeight = (0 - scrollTop) / 2
            if (local.topHeight > 30) {
              local.backedToTop = false;
              local.topHeight = 0
              local.trigerTopLimit = true
              const willRefresh = refresh ? refresh : loader.refresh;
              const ts = Date.now();
              willRefresh().then(() => {
                local.topHeight = 0
                local.showFinished = true
                if (Date.now() - ts > 500) {
                  local.trigerTopLimit = false
                } else {
                  setTimeout(() => {
                    local.trigerTopLimit = false
                  }, 300)
                }

              })
            }
          } else if (scrollTop >= 0) {
            local.showFinished = false
            local.backedToTop = true;
          }
          if (offset <= -10 && !loader.isLoading && !local.touchedBottom) {
            local.touchedBottom = true
            if (!loader.isEnded) {
              loadMore ? loadMore() : loader.loadMore();
            }
          } else if (offset >= 0) {
            local.touchedBottom = false
          }
        }}>
          {local.trigerTopLimit ? <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: 30,
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center'
          }}>正在刷新</div> : <div style={{ top: 0, position: 'relative', textAlign: 'center', left: 0, display: 'flex', flexDirection: 'column', justifyItems: 'flex-start', height: local.showFinished ? 30 : local.topHeight, overflow: 'hidden' }}>{local.showFinished ? '已完成' : '刷新↓'}</div>}
          {loader.items.map((item, index) => <div key={index} style={itemWrapStyle}>{renderItem(item, loader.name, index)}</div>)}
        </div>
      }
    }}</Observer>
  );
};

export default GetPullToRefreshlData;
