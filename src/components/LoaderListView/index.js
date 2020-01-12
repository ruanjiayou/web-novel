import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { ListView, PullToRefresh } from 'antd-mobile'
import renderEmptyView from '../EmptyView'
import AutoCenterView from '../AutoCenterView'
import SwitchView from '../SwitchView'

const dataProvider = new ListView.DataSource({
  rowHasChanged: (row1, row2) => false
})

function MyBody(props) {
  return <div className={`am-list-body ${props.className}`}>{props.children}</div>
}

function renderList({ loader, refresh, loadMore, renderItem, onScroll, className, renderEmpty }) {
  const dataSource = dataProvider.cloneWithRows(loader.items.slice())
  const EmptyView = renderEmptyView(loader, renderEmpty, refresh)
  // 必须要这样.不能直接用 loader.isLoading判断
  const isLoading = loader.isLoading
  return <Fragment>
    <SwitchView
      loading={loader.isEmpty || loader.isError}
      holder={<AutoCenterView>{EmptyView}</AutoCenterView>}>
      <ListView
        style={{ height: '100%', overflow: 'auto' }}
        dataSource={dataSource}
        // 自带的.没有写就默认滚到底部了
        onScroll={onScroll}
        renderRow={(rowData, sectionId, rowId) => renderItem(rowData, sectionId, rowId)}
        renderBodyComponent={() => <MyBody className={className} />}
        initialListSize={Infinity}
        onEndReachedThreshold={10}
        onEndReached={loadMore ? loadMore : loader.loadMore}
        pullToRefresh={<PullToRefresh refreshing={false} onRefresh={refresh ? refresh : loader.refresh} />}
        /**
         * useBodyScroll
         * onScroll
         */
        renderFooter={() => <div style={{ textAlign: 'center', padding: 5 }}>{isLoading ? '正在加载更多数据...' : '已全部加载完毕'}</div>}
      />
    </SwitchView>

  </Fragment>
}

export default function (props) {
  // const { loader } = props;
  // useEffectOnce(() => {
  //   if (loader.isEmpty) {
  //     loader.refresh();
  //   }
  // });
  return <div style={{ display: 'flex', flex: '1 1', height: '100%', flexDirection: 'column' }}>
    <Observer>
      {() => {
        return renderList(props)
      }}
    </Observer>
  </div>
}
