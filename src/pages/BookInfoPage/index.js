import React, { Fragment, useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ActivityIndicator, Icon } from 'antd-mobile'

import { useRouterContext } from 'contexts'
import { MIconView, AutoCenterView, VisualBoxView } from 'components'
import ResourceLoader from 'loader/ResourceLoader'
import services from 'services'

export default function () {
  const router = useRouterContext()
  const loader = ResourceLoader.create()
  const params = router.params
  const localStore = useLocalStore(() => ({
    loading: false,
    firstLoading: false,
    shouldFix: false,
    id: params.id,
  }))
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh({ params: { id: localStore.id } })
    }
  })
  return <Observer>{
    () => {
      if (loader.isEmpty) {
        return <AutoCenterView>
          <ActivityIndicator text="加载中..." />
        </AutoCenterView>
      } else {
        return <Fragment>
          <div className="full-height">
            <div className="dd-common-alignside" style={{ position: 'absolute', width: '100%', boxSizing: 'border-box', height: 45, padding: '0 15px' }}>
              <MIconView type="FaChevronLeft" onClick={() => { router.back() }} />
              <div>
                <VisualBoxView visible={localStore.shouldFix}>
                  <div>我的机器人女友</div>
                  <div>松下中二 · 科幻</div>
                </VisualBoxView>
              </div>
              <MIconView type="FaEllipsisH" />
            </div>
            <div className="full-height-auto">
              <div style={{ padding: '20px 0 10px 0', textAlign: 'center', backgroundColor: '#666', color: 'white' }}>
                <img src={loader.item.poster} alt="" width={100} height={120} />
                <div style={{ fontSize: 20, padding: 5 }}>{loader.item.title}</div>
                <div>{loader.item.uname} · 科幻</div>
              </div>
              <div style={{ padding: '0 20px', borderBottom: '1px solid #ccc', backgroundColor: 'snow' }}>
                <div className="dd-common-alignside" style={{ height: 50, borderBottom: '1px solid #ccc' }}>
                  <div className="dd-common-centerXY" style={{ flex: 1 }}>
                    {loader.item.words}万字
                  </div>
                  <div className="dd-common-centerXY" style={{ flex: 1 }}>
                    {loader.item.chapters}章
                  </div>
                  <div className="dd-common-centerXY" style={{ flex: 1 }}>
                    {loader.item.comments}评论
                  </div>
                </div>
                <div style={{ padding: '10px 0', borderBottom: '1px solid #ccc' }} dangerouslySetInnerHTML={{ __html: loader.item.desc }}>
                </div>
                <div className="full-width" style={{ height: 40 }} onClick={() => { router.pushView(`/root/book/${localStore.id}/catalog`, null, { hideMenu: true }) }}>
                  <span className="full-width-auto" style={{ fontWeight: 'bolder' }}>目录</span>
                  <span className="full-width-fix">连载至 729章 · 两小时前更新</span>
                  <MIconView style={{ marginLeft: 10 }} className="full-width-fix" type="FaAngleRight" />
                </div>
              </div>
              <p>TODO:作者 名称 头像 几部作品</p>
            </div>
            <div className="dd-common-alignside" style={{ height: 50 }}>
              <div className="dd-common-centerXY" style={{ flex: 1, backgroundColor: 'rgb(226, 223, 223)', color: 'gray' }}>+ 加入书架</div>
              <div className="dd-common-centerXY" style={{ flex: 1, backgroundColor: 'red', color: 'white' }} onClick={async () => {
                try {
                  localStore.firstLoading = true
                  const info = await services.getBookFirstChapter({ params: { id: localStore.id } })
                  router.pushView(`/root/book/${localStore.id}/chapter/${info.item.id}`, null, { hideMenu: true, bid: localStore.id, id: info.item.id })
                } catch (err) {

                } finally {
                  localStore.firstLoading = false
                }
              }}><VisualBoxView visible={localStore.firstLoading}><Icon type="loading" /></VisualBoxView>立即阅读</div>
            </div>
          </div>
        </Fragment>
      }
    }
  }</Observer>
}