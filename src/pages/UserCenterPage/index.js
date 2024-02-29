import React, { useEffect } from 'react'
import { Observer } from 'mobx-react-lite'
import { ActivityIndicator, Card, WingBlank, Button, WhiteSpace } from 'antd-mobile'

import { UserLoader } from 'loader'
import { MIconView, SwitchView, VisualBoxView, Tabs } from 'components'
import createPageModel from 'page-group-loader-model/BasePageModel'
import PinchZoom from 'components/PinchZoom/self'
import showTip from 'utils/showTip';

const model = createPageModel({
  UserLoader,
})

function View({ self, router, store, }) {
  const userLoader = self.UserLoader
  useEffect(() => {
    if (store.app.isLogin && userLoader.isEmpty) {
      userLoader.refresh()
    }
  })
  return <Observer>{
    () => {
      return <div className="full-height" style={{ paddingLeft: 'calc(env(safe-area-inset-left) + 10px )', paddingRight: 'calc(env(safe-area-inset-right) + 10px )' }} onTouchStart={e => e.preventDefault()} onTouchMove={e => e.preventDefault()}>
        <div className="full-width full-height-fix">
          <div className="full-width-fix dd-common-centerXY" style={{ width: 50, height: 50, margin: '15px 0' }}>
            {/* TODO: 测试 */}
            {/* <img src={userLoader.isEmpty ? '' : userLoader.item.avater} /> */}
            {userLoader.isLoading ? <ActivityIndicator /> : <img src="/logo.jpg" style={{ borderRadius: '50%', width: '100%', height: '100%' }} alt="" />}
          </div>
          <div className="full-width-auto" style={{ paddingLeft: 10 }}>
            <SwitchView loading={!store.app.isLogin} holder={<Button type="ghost" inline size="small" onClick={() => { router.pushView('login') }}>登录</Button>}>
              {userLoader.isEmpty ? '---' : userLoader.item.name}
            </SwitchView>
          </div>
          <VisualBoxView visible={store.app.isLogin}>
            <div style={{ color: 'green' }}>
              <MIconView type="FaQrcode" />
            </div>
            {/* TODO: 个人信息页面 */}
            <div className="full-width-fix" onClick={() => router.pushView('UserSetting')}><MIconView type="FaAngleRight" /></div>
          </VisualBoxView>
        </div>
        <WingBlank className='full-height-auto' style={{ paddingBottom: 10 }}>
          <Card style={{ minHeight: 40, paddingBottom: 0 }}>
            <div className="dd-common-alignside" style={{ padding: '20px 40px', }}>
              <div style={{ color: '#f97a90' }} onClick={() => {
                if (store.app.isLogin) {
                  router.pushView('Marked')
                } else {
                  showTip(router)
                }
              }}>
                <MIconView type="FaStar" />收藏
              </div>
              <div onClick={() => {
                router.pushView('Record')
              }} >
                <MIconView type="FaHistory" style={{ color: '#14b2f7' }} />历史
              </div>
              <div onClick={() => {
                router.pushView('UserSecure')
              }}>
                <MIconView type="FaLock" style={{ color: '#236f07' }} />安全
              </div>
              <div onClick={() => window.location.reload()}>
                <MIconView type="FaSyncAlt" />刷新
              </div>
            </div>
          </Card>
          <WhiteSpace />
          <Card style={{ minHeight: 40, padding: '10px 0' }}>
            <div className="dd-common-alignside" style={{ margin: '10px 30px' }}>
              <div onClick={() => {
                router.pushView('BookSearch')
              }}>
                <MIconView type="FaListAlt" style={{ color: '#ff5b05' }} />小说
              </div>
              <div onClick={() => {
                if (store.app.isLogin) {
                  router.pushView('GroupTree', { name: 'image' })
                } else {
                  router.pushView('login')
                }
              }} style={{ color: '#0a925d' }}>
                <MIconView type="FaImages" />图片
              </div>
              <div onClick={() => {
                if (store.app.isLogin) {
                  router.pushView('Music')
                } else {
                  showTip(router);
                }
              }} style={{ color: '#bb00ff' }}>
                <MIconView type="IoMdMusicalNote" />歌单
              </div>
              <div onClick={() => {
                if (store.app.isLogin) {
                  router.pushView('UserShelf')
                } else {
                  showTip(router)
                }
              }} style={{ color: '#bb00ff' }}>
                <MIconView type="MdApps" />书架
              </div>
            </div>
            <div className="dd-common-alignside" style={{ margin: '10px 30px' }}>
              <div onClick={() => {
                router.pushView('GroupTree', { name: 'article' })
              }} style={{ color: '#258df1' }}>
                <MIconView type="FaFileAlt" />文章
              </div>
              <div onClick={() => {
                router.pushView('GroupTree', { name: 'news' })
              }} style={{ color: 'red' }}>
                <MIconView type="FaFileAlt" />资讯
              </div>
              <div>
                <MIconView type="FaEllipsisV" />其他
              </div>
              <div style={{ visibility: 'hidden' }}>
                <MIconView type="FaEllipsisV" />其他
              </div>
            </div>
          </Card>
          {/* <PinchZoom wrapStyle={{ width: '100%', height: 250, position: 'relative' }}>
            <img style={{ width: '100%', height: '100%' }} src="/logo.jpg" />
          </PinchZoom> */}
        </WingBlank>
      </div>
    }
  }</Observer >
}

export default {
  group: {
    view: 'mine',
  },
  View,
  model,
}