import React, { useEffect } from 'react'
import { Observer } from 'mobx-react-lite'
import { ActivityIndicator, Card, WingBlank, Button, WhiteSpace } from 'antd-mobile'

import { UserLoader } from 'loader'
import { MIconView, SwitchView, VisualBoxView } from 'components'
import createPageModel from 'page-group-loader-model/BasePageModel'

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
      return <div className="full-height" onTouchStart={e => e.preventDefault()} onTouchMove={e => e.preventDefault()}>
        <div className="full-width" style={{ padding: '0 20px' }}>
          <div className="full-width-fix dd-common-centerXY" style={{ width: 35, height: 35, margin: '10px 0' }}>
            {/* TODO: 测试 */}
            {/* <img src={userLoader.isEmpty ? '' : userLoader.item.avater} /> */}
            {userLoader.isLoading ? <ActivityIndicator /> : <img src="/logo.jpg" style={{ borderRadius: '50%' }} alt="" />}
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
        <WingBlank>
          <Card style={{ minHeight: 40, paddingBottom: 0 }}>
            <div className="dd-common-alignside" style={{ padding: '10px 40px', }}>
              <div style={{ color: '#f97a90' }} onClick={() => {
                router.pushView('Marked')
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
          <Card style={{ minHeight: 40, padding: '5px 0' }}>
            <div className="dd-common-alignside" style={{ margin: '5px 50px' }}>
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
                router.pushView('Music')
              }} style={{ color: '#bb00ff' }}>
                <MIconView type="IoMdMusicalNote" />歌单
              </div>
              <div onClick={() => {
                router.pushView('UserShelf')
              }} style={{ color: '#bb00ff' }}>
                <MIconView type="MdApps" />书架
              </div>
            </div>
            <div className="dd-common-alignside" style={{ margin: '5px 50px' }}>
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
              <div onClick={() => {
                router.pushView('MusicPlayer', { id: '692884EACEB545A295E88B66852499C0' })
              }} style={{ color: '#bb00ff' }}>
                <MIconView type="IoMdMusicalNote" />音乐
              </div>
            </div>
          </Card>
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