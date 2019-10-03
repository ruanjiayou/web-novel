import React, { Fragment, useEffect, useRef } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ActivityIndicator, Progress } from 'antd-mobile'

import { useRouterContext } from 'contexts/router'
import 'components/common.css'
import renderEmpty from 'components/EmptyView'
import AutoCenterView from 'components/AutoCenterView'
import VisualBoxView from 'components/VisualBoxView'
import MIconView from 'components/MIconView'

import services from 'services'
import ChapterModel from 'models/ChapterModel'
import { createItemLoader } from 'loader/BaseLoader'

export default function () {
  const router = useRouterContext()
  const container = useRef(null)
  const loader = createItemLoader(ChapterModel, async (params) => services.getBookChapter(params)).create()
  const emptyView = renderEmpty(loader)
  const localStore = useLocalStore(() => ({
    pop: false,
    percent: 0,
  }))
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh({ id: router.getStateKey('id'), bid: router.getStateKey('bid') })
    }
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
              <MIconView type={'FaPlayCircle'} style={{ margin: '0 10px' }} />
              <MIconView type={'FaEllipsisH'} style={{ margin: '0 10px' }} />
            </div>
          </div>
        </VisualBoxView>
        {/* 内部文字 */}
        <div className="full-height" style={{ padding: '0 15px' }} onClick={() => { localStore.pop = !localStore.pop }}>
          <VisualBoxView visible={loader.isEmpty}>
            <AutoCenterView>
              <ActivityIndicator text="加载中..." />
            </AutoCenterView>
          </VisualBoxView>
          {!loader.isEmpty && <Fragment>
            <div style={{ padding: '8px 0', color: 'grey' }}>第{loader.item.order}章 {loader.item.title}</div>
            <div
              ref={container}
              className="full-height-auto"
              style={{ lineHeight: 2, letterSpacing: 2, fontSize: 16, textIndent: 20 }}
              onScroll={() => {
                // container.current.offsetHeight = container.current.scrollHeight - container.current.scrollTop;
                let height = container.current.scrollHeight - container.current.offsetHeight
                if (height <= 0) {
                  height = 1
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
              <span className="full-width-fix">上一章</span>
              <Progress percent={localStore.percent} position={'normal'} className="full-width-auto" style={{ margin: '0 10px' }} />
              <span className="full-width-fix">下一章</span>
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