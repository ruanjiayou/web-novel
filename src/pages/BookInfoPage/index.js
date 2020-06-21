import React, { Fragment, useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ActivityIndicator, Icon, Button } from 'antd-mobile'
import timespan from 'utils/timespan'
import { useRouterContext } from 'contexts'
import { MIconView, AutoCenterView, VisualBoxView, ImgLine } from 'components'
import ResourceLoader from 'loader/ResourceLoader'
import services from 'services'
import store from 'global-state'

export default function ({ params }) {
  const router = useRouterContext()
  const loader = ResourceLoader.create()
  const localStore = useLocalStore(() => ({
    loading: false,
    firstLoading: false,
    shouldFix: false,
    id: params ? params.id : router.params.id,
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
              <div style={{ padding: '20px 0 10px 0', textAlign: 'center', backgroundColor: '#bfbaba', color: 'white' }}>
                <ImgLine src={loader.item.poster} alt="" width={100} height={120} />
                <div style={{ fontSize: 20, padding: 5 }}>{loader.item.title}</div>
                <div>{loader.item.uname} · 科幻</div>
              </div>
              <div style={{ padding: '0 20px', borderBottom: '1px solid #ccc', backgroundColor: 'snow' }}>
                <div className="dd-common-alignside" style={{ height: 50 }}>
                  <div className="dd-common-centerXY" style={{ flex: 1 }}>
                    {Math.round(loader.item.words / 10000)}万字
                  </div>
                  <div className="dd-common-centerXY" style={{ flex: 1 }}>
                    {loader.item.chapters}章
                  </div>
                  <div className="dd-common-centerXY" style={{ flex: 1 }}>
                    {loader.item.comments}评论
                  </div>
                </div>
                <div className="dd-common-alignside">
                  <Button type="primary" size="small" loading={localStore.firstLoading} onClick={async () => {
                    try {
                      localStore.firstLoading = true
                      const info = await services.getBookFirstChapter({ params: { id: localStore.id } })
                      router.pushView(`chapter-info`, null, { bid: localStore.id, id: info.item.id })
                    } catch (err) {

                    } finally {
                      localStore.firstLoading = false
                    }
                  }}>
                    立即阅读
                  </Button>
                  <Button type="ghost" size="small" style={{ minWidth: 82 }} onClick={() => {
                    window.open(`${store.app.baseURL}/v1/public/download/book/${localStore.id}`, '_blank')
                  }}>下载</Button>
                </div>
                <p style={{ marginBottom: 8 }}>内容简介:</p>
                <div style={{ lineHeight: 1.5, color: '#555', textIndent: 20, borderBottom: '1px solid #ccc', minHeight: 120 }} dangerouslySetInnerHTML={{ __html: loader.item.desc }}>
                </div>
                <div className="full-width" style={{ height: 40 }} onClick={() => { router.pushView(`book-catalog`, null, { id: localStore.id }) }}>
                  <span className="full-width-auto" style={{ fontWeight: 'bolder' }}>目录</span>
                  <span className="full-width-fix">连载至 {loader.item.chapters}章 · {timespan(new Date())}更新</span>
                  <MIconView style={{ marginLeft: 10 }} className="full-width-fix" type="FaAngleRight" />
                </div>
              </div>
              <p>TODO:作者 名称 头像 几部作品</p>
            </div>
          </div>
        </Fragment>
      }
    }
  }</Observer>
}