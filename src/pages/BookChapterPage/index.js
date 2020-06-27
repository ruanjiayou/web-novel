import React, { Fragment, useEffect, useRef } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ActivityIndicator, Progress } from 'antd-mobile'

import { ChapterLoader } from 'loader'
import createPageModel from 'page-group-loader-model/BasePageModel'
import { EmptyView, AutoCenterView, VisualBoxView, MIconView } from 'components'

const model = createPageModel({
  ChapterLoader,
});

function View({ self, router, params }) {
  const loader = self.ChapterLoader
  const emptyView = EmptyView(loader)
  const localStore = useLocalStore(() => ({
    pop: false,
    percent: 0,
    id: params.id,
    bid: params.bid,
  }))
  const container = useRef(null)
  useEffect(() => {
    loader.refresh({ params: { id: localStore.id, bid: localStore.bid } })
  })
  return <Observer>
    {() => {
      return <Fragment>
        {/* 顶部导航动态 */}
        <VisualBoxView visible={localStore.pop}>
          <div className="dd-common-alignside" style={{ position: 'absolute', left: 0, top: 0, right: 0, backgroundColor: '#eee', height: 45, padding: '0 15px' }}>
            <MIconView type="FaChevronLeft" onClick={() => { router.back() }} />
            <div className="dd-common-alignside">
              <MIconView type={'FaCloudDownloadAlt'} style={{ margin: '0 10px' }} />
              <MIconView type={'IoIosHeadset'} style={{ margin: '0 10px' }} />
              <MIconView type={'FaEllipsisH'} style={{ margin: '0 10px' }} />
            </div>
          </div>
        </VisualBoxView>
        {/* 内部文字 */}
        <div className="full-height" style={{ padding: '0 15px' }} onClick={() => { localStore.pop = !localStore.pop }}>
          <VisualBoxView visible={loader.isEmpty}>
            <AutoCenterView>
              {loader.isError ? <div>{loader.error.code} {loader.error.message}</div> : <ActivityIndicator text="加载中..." />}
            </AutoCenterView>
          </VisualBoxView>
          {!loader.isEmpty && <Fragment>
            <div style={{ padding: '8px 0', color: 'grey' }}>{loader.item.title}</div>
            <div
              ref={container}
              className="full-height-auto scroll-smooth smooth"
              style={{ lineHeight: 2, letterSpacing: 2, fontSize: 16, textIndent: 20 }}
              onScroll={() => {
                // container.current.offsetHeight = container.current.scrollHeight - container.current.scrollTop;
                let height = container.current.scrollHeight - container.current.offsetHeight
                if (height <= 0) {
                  height = 1
                }
                if (container.current.scrollTop < 1) {
                  container.current.scrollTop = 1
                }
                if (container.current.scrollTop === height) {
                  container.current.scrollTop = height - 1
                }
                localStore.percent = (100 * container.current.scrollTop / height).toFixed(1)
              }}
            >
              {loader.isEmpty ? emptyView : <div>{loader.item.content}</div>}
            </div>
            <div className="dd-common-alignside" style={{ padding: '8px 0', color: 'grey' }}>
              <div className="dd-common-alignside">
                <span style={{ marginRight: 10 }}>2/12</span>
                <span>{localStore.percent}%</span>
              </div>
              <div className="dd-common-alignside">
                <span style={{ marginRight: 10 }}>03:54</span>
                <MIconView type="FaBatteryHalf" style={{ display: 'inline-block', marginRight: 10 }} />
                <span>{loader.isEmpty ? 0 : loader.item.content.length}</span>
              </div>
            </div>
          </Fragment>}
        </div>
        {/* 底部动态菜单 */}
        <VisualBoxView visible={localStore.pop}>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, fontSize: 12, backgroundColor: '#eee', padding: '0 10px' }}>
            <div className="full-width" style={{ height: 40 }}>
              <span className="full-width-fix" style={{ opacity: loader.isEmpty || loader.item.preId === '' ? 0.5 : 1 }} onClick={() => {
                if (!loader.isEmpty && loader.item.preId) {
                  loader.refresh({ params: { bid: localStore.bid, id: loader.item.preId } })
                }
              }}>上一章</span>
              <Progress percent={localStore.percent} position={'normal'} className="full-width-auto" style={{ margin: '0 10px' }} />
              <span className="full-width-fix" style={{ opacity: loader.isEmpty || loader.item.nextId === '' ? 0.5 : 1 }} onClick={() => {
                if (!loader.isEmpty && loader.item.nextId) {
                  localStore.id = loader.item.nextId
                  loader.refresh({ params: { id: localStore.id, bid: localStore.bid } })
                  container.current.scrollTop = 1
                  // let id = loader.item.nextId
                  // loader.clear()
                  // router.replaceView(`/root/book/${localStore.bid}/chapter/${id}`, null, { hideMenu: true })
                }
              }}>下一章</span>
            </div>
            <div className="full-width" style={{ height: 50 }}>
              <div className="full-width-fix dd-common-centerXY" style={{ flexDirection: 'column' }}>
                <MIconView type="FaListUl" />目录
              </div>
              <div className="full-width-auto dd-common-centerXY" style={{ flexDirection: 'column' }}>
                <MIconView type="FaCog" />设置
              </div>
              <div className="full-width-fix dd-common-centerXY" style={{ flexDirection: 'column' }}>
                <MIconView type="FaEllipsisH" />其他
              </div>
            </div>
          </div>
        </VisualBoxView>
      </Fragment>
    }}
  </Observer>
}

export default {
  group: {
    view: 'BookChapter',
  },
  model,
  View,
}