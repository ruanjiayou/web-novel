import React, { Fragment, useEffect, useRef, useCallback } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ActivityIndicator, Progress } from 'antd-mobile'

import { ChapterLoader } from 'loader'
import Recorder from 'utils/cache'
import createPageModel from 'page-group-loader-model/BasePageModel'
import { EmptyView, AutoCenterView, VisualBoxView, MIconView } from 'components'
import { FullHeight, FullHeightAuto, FullHeightFix } from 'components/common'

const bookRecorder = new Recorder('book')
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
  const refresh = useCallback(() => {
    loader.refresh({ params: { id: localStore.id, bid: localStore.bid } }, async function (res) {
      console.log(res);
      const data = await bookRecorder.getValue(localStore.bid)
      if (data && res && res.item) {
        data.data.last_seen_ts = Date.now();
        data.data.last_seen_id = res.item.id;
        data.data.last_seen_title = res.item.title;
        bookRecorder.setValue(localStore.bid, data.data)
      }
    })
  })
  useEffect(() => {
    refresh();
  })
  return <Observer>
    {() => {
      return <FullHeight>
        {/* 顶部导航动态 */}
        <FullHeightFix className="dd-common-alignside" style={{ backgroundColor: '#eee', height: 45, padding: '0 15px' }}>
          <MIconView type="FaChevronLeft" onClick={() => { router.back() }} />
          {loader.item && loader.item.title}
          <div className="dd-common-alignside">
            <MIconView type={'FaCloudDownloadAlt'} style={{ margin: '0 10px' }} />
            <MIconView type={'IoIosHeadset'} style={{ margin: '0 10px' }} />
            <MIconView type={'FaEllipsisH'} style={{ margin: '0 10px' }} />
          </div>
        </FullHeightFix>
        {/* 内部文字 */}
        <FullHeightAuto style={{ padding: '0 15px' }} onClick={() => { localStore.pop = !localStore.pop }}>
          <VisualBoxView visible={loader.isEmpty}>
            <AutoCenterView>
              {loader.isError ? <div>{loader.error.code} {loader.error.message}</div> : <ActivityIndicator text="加载中..." />}
            </AutoCenterView>
          </VisualBoxView>
          {!loader.isEmpty && <Fragment>
            <FullHeightAuto
              ref={container}
              className="scroll-smooth smooth"
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
            </FullHeightAuto>
          </Fragment>}
        </FullHeightAuto>
        <FullHeightFix className="dd-common-alignside" style={{ padding: 8, color: 'grey' }}>
          <div className="dd-common-alignside">
            <span style={{ marginRight: 10 }}>2/12</span>
            <span>{localStore.percent}%</span>
          </div>
          <div className="dd-common-alignside">
            <MIconView type="FaBatteryHalf" style={{ marginRight: 10 }} />
            <span>{loader.isEmpty ? 0 : loader.item.content.length}</span>
          </div>
        </FullHeightFix>
        {/* 底部动态菜单 */}
        <VisualBoxView visible={localStore.pop}>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, fontSize: 12, backgroundColor: '#eee', padding: '0 10px' }}>
            <div className="full-width" style={{ height: 40 }}>
              <span className="full-width-fix" style={{ opacity: loader.isEmpty || loader.item.preId === '' ? 0.5 : 1 }} onClick={() => {
                if (!loader.isEmpty && loader.item.preId) {
                  localStore.id = loader.item.preId
                  refresh();
                }
              }}>上一章</span>
              <Progress percent={localStore.percent} position={'normal'} className="full-width-auto" style={{ margin: '0 10px' }} />
              <span className="full-width-fix" style={{ opacity: loader.isEmpty || loader.item.nextId === '' ? 0.5 : 1 }} onClick={() => {
                if (!loader.isEmpty && loader.item.nextId) {
                  localStore.id = loader.item.nextId
                  refresh();
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
      </FullHeight>
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