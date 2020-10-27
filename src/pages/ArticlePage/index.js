import React, { Fragment, useEffect, useRef } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ActivityIndicator, Progress } from 'antd-mobile'

import { ResourceLoader } from 'loader'
import createPageModel from 'page-group-loader-model/BasePageModel'
import { EmptyView, AutoCenterView, VisualBoxView, MIconView } from 'components'
import { FullWidth, FullHeightFix } from 'components/common'

const model = createPageModel({ ResourceLoader });

function View({ self, router, store, params = {} }) {
  const loader = self.ResourceLoader
  const emptyView = EmptyView(loader)
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
        {/* 内部文字 */}
        <div className="full-height" style={{ padding: '0 15px' }}>

          <FullWidth className="full-height-fix" style={{ padding: '8px 0', color: 'grey' }}>
            <FullHeightFix>
              <MIconView type="FaChevronLeft" onClick={() => { router.back() }} />
            </FullHeightFix>
            <FullHeightFix>
              {loader.item ? loader.item.title : 'loading'}
            </FullHeightFix>
          </FullWidth>
          <VisualBoxView visible={loader.isEmpty}>
            <AutoCenterView>
              <ActivityIndicator text="加载中..." />
            </AutoCenterView>
          </VisualBoxView>
          {!loader.isEmpty && <Fragment>
            <div
              className="full-height-auto content"
              style={{ width: '100%', fontSize: 14 }}
            >
              {loader.isEmpty ? emptyView : <div dangerouslySetInnerHTML={{ __html: loader.item.content }}>{}</div>}
            </div>
            <div className="dd-common-alignside" style={{ padding: '8px 0', color: 'grey' }}>
              <div className="dd-common-alignside">
                <span>{localStore.percent}%</span>
              </div>
              <div className="dd-common-alignside">
                <span style={{ marginRight: 10 }}>{new Date().getHours()}:{new Date().getMinutes()}</span>
              </div>
            </div>
          </Fragment>}
        </div>
      </Fragment>
    }}
  </Observer>
}

export default {
  model,
  View,
  group: {
    view: 'Article',
    attrs: {},
  },
}