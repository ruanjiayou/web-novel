import React, { Fragment, useEffect, useRef } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ActivityIndicator, Progress } from 'antd-mobile'

import { useRouterContext } from 'contexts'
import { EmptyView, AutoCenterView, VisualBoxView, MIconView } from 'components'
import ResourceLoader from 'loader/ResourceLoader'
import createPageModel from 'page-group-loader-model/BasePageModel'

export const ViewModel =  createPageModel({ ResourceLoader });

export const config = {
  view: '',
  attrs: {},
}

export default function ({ self }) {
  const router = useRouterContext()
  const loader = self.ResourceLoader
  const emptyView = EmptyView(loader)
  const params = router.params
  const localStore = useLocalStore(() => ({
    pop: false,
    percent: 0,
    id: params.id,
  }))
  useEffect(() => {
    loader.refresh({ params: { id: localStore.id } })
  })
  return <Observer>
    {() => {
      return <Fragment>
        {/* 顶部导航动态 */}
        <VisualBoxView visible={localStore.pop}>
          <div className="dd-common-alignside" style={{ position: 'absolute', left: 0, top: 0, right: 0, backgroundColor: '#eee', height: 45, padding: '0 15px' }}>
            <MIconView type="FaChevronLeft" onClick={() => { router.back() }} />
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
            <div style={{ padding: '8px 0', color: 'grey' }}>{loader.item.title}</div>
            <div
              className="full-height-auto"
              style={{ width: '100%', fontSize: 14 }}
            >
              {loader.isEmpty ? emptyView : <div dangerouslySetInnerHTML={{ __html: loader.item.content }}>{}</div>}
            </div>
            <div className="dd-common-alignside" style={{ padding: '8px 0', color: 'grey' }}>
              <div className="dd-common-alignside">
                <span style={{ marginRight: 10 }}>2/12</span>
                <span>{localStore.percent}%</span>
              </div>
              <div className="dd-common-alignside">
                <span style={{ marginRight: 10 }}>03:54</span>
                <MIconView type="FaBatteryHalf" style={{ display: 'inline-block', marginRight: 10 }} />
                {/* <span>{loader.isEmpty ? 0 : loader.item.content.length}</span> */}
              </div>
            </div>
          </Fragment>}
        </div>
        {/* 底部动态菜单 */}
        <VisualBoxView visible={localStore.pop}>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, fontSize: 12, backgroundColor: '#eee', padding: '0 10px' }}>
            <div className="full-width" style={{ height: 40 }}>
              <Progress percent={localStore.percent} position={'normal'} className="full-width-auto" style={{ margin: '0 10px' }} />
            </div>
          </div>
        </VisualBoxView>
      </Fragment>
    }}
  </Observer>
}