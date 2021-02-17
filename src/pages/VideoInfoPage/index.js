import React, { Fragment, useEffect, useCallback } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ActivityIndicator, Icon, Button, Toast, Tag } from 'antd-mobile'

import timespan from 'utils/timespan'
import { ResourceLoader } from 'loader'
import { MIconView, AutoCenterView, VisualBoxView, EmptyView } from 'components'
import createPageModel from 'page-group-loader-model/BasePageModel'
import Recorder from 'utils/cache'
import { useEffectOnce } from 'react-use'

const videoRecorder = new Recorder('video')
const model = createPageModel({
  ResourceLoader,
})

function View({ self, router, store, services, params }) {
  const loader = self.ResourceLoader
  const localStore = useLocalStore(() => ({
    loading: false,
    firstLoading: false,
    shouldFix: false,
    id: params.id,
  }))
  useEffectOnce(() => {
    videoRecorder.getValue(params.id).then(result => {
      if (result) {

      }
    })
    return (() => {
      loader.clear()
    })
  })
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh({ params: { id: localStore.id } })
    }
  })
  return <Observer>{
    () => {
      if (loader.isLoading) {
        return <AutoCenterView>
          <ActivityIndicator text="加载中..." />
        </AutoCenterView>
      } else if (loader.isEmpty) {
        return EmptyView(loader, <div>empty</div>, function () {
          loader.refresh({ params: { id: localStore.id } })
        })
      } else {
        return <Fragment>
          <div className="full-height">
            <div className="dd-common-alignside" style={{ position: 'absolute', width: '100%', boxSizing: 'border-box', height: 45, padding: '0 15px' }}>
              <MIconView type="FaChevronLeft" onClick={() => { router.back() }} />
              <div>
                <VisualBoxView visible={localStore.shouldFix}>
                  <div>{loader.item.title}</div>
                  <div>{loader.item.chapters}集</div>
                </VisualBoxView>
              </div>
              <MIconView type="FaEllipsisH" />
            </div>
            <div className="full-height-auto">
              <div style={{ padding: '20px 0 10px 0', textAlign: 'center', backgroundColor: '#bfbaba', color: 'white' }}>
                <img src={loader.item.auto_cover} alt="" width={100} height={120} />
                <div style={{ fontSize: 20, padding: 5 }}>{loader.item.title}</div>
                <div>{loader.item.chapters}集</div>
              </div>
              <div style={{ padding: '0 20px', borderBottom: '1px solid #ccc', backgroundColor: 'snow' }}>

                <p style={{ marginBottom: 8 }}>内容简介:</p>
                <div style={{ lineHeight: 1.5, color: '#555', textIndent: 20, borderBottom: '1px solid #ccc', minHeight: 120 }} dangerouslySetInnerHTML={{ __html: loader.item.desc }}>
                </div>
                <p style={{ fontWeight: 'bolder', margin: 0, padding: '5px 0' }}>播放列表:</p>
                <div>{loader.item.children.map(child => (
                  <Tag
                    closable={false}
                    small
                    onChange={() => {
                      router.pushView('VideoPlayer', { id: child.id, mid: localStore.id })
                    }}
                    selected={false}
                    key={child.path}
                    style={{ margin: 3 }}>
                    {child.title || `第${child.nth}集`}
                  </Tag>
                ))}
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      }
    }
  }</Observer>
}

export default {
  group: {
    view: 'VideoInfo',
  },
  model,
  View,
}