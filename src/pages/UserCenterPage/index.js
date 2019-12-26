import React, { useEffect } from 'react'
import { Observer } from 'mobx-react-lite'
import { ActivityIndicator, Card, WingBlank, Button } from 'antd-mobile'
import { useStoreContext, useRouterContext } from 'contexts'
import { MIconView, SwitchView, VisualBoxView } from 'components'

export default function () {
  const store = useStoreContext()
  const router = useRouterContext()
  const userLoader = store.userLoader
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
            <SwitchView loading={!store.app.isLogin} holder={<Button type="ghost" inline size="small" onClick={() => { router.pushView('/auth/login', null, { hideMenu: true, showNavi: true }) }}>登录</Button>}>
              {userLoader.isEmpty ? '---' : userLoader.item.name}
            </SwitchView>
          </div>
          <VisualBoxView visible={store.app.isLogin}>
            <div style={{ color: 'green' }}>
              <MIconView type="FaQrcode" />
            </div>
            {/* TODO: 个人信息页面 */}
            <div className="full-width-fix" onClick={() => router.pushView('/root/user-setting', null)}><MIconView type="FaAngleRight" /></div>
          </VisualBoxView>
        </div>
        <WingBlank>
          <Card>
            <div className="dd-common-alignside" style={{ padding: '10px 50px' }}>
              <div style={{ color: '#f97a90' }}>
                <MIconView type="FaStar" />收藏
              </div>
              <div>
                <MIconView type="FaHistory" style={{ color: '#14b2f7' }} />历史
              </div>
              <div>
                <MIconView type="FaEllipsisV" />其他
              </div>
            </div>
            <div className="dd-common-alignside" style={{ padding: '10px 50px' }}>
              <div onClick={() => {
                router.pushView('/root/secure', null, { title: '安全' })
              }}>
                <MIconView type="FaLock" style={{ color: '#236f07' }} />安全
              </div>
              <div onClick={() => window.location.reload()}>
                <MIconView type="FaSyncAlt" />刷新
              </div>
              <div onClick={() => {
                router.pushView('/root/category', null, { hideMenu: true })
              }}>
                <MIconView type="FaListAlt" style={{ color: '#ff5b05' }} />分类
          </div>
            </div>
            <div className="dd-common-alignside" style={{ padding: '10px 50px' }}>
              <div onClick={() => {
                if (store.app.isLogin) {
                  router.pushView('/root/gallery', null, { hideMenu: true })
                } else {
                  router.pushView('/auth/login', null, { hideMenu: true, showNavi: true })
                }
              }} style={{ color: 'red' }}>
                <MIconView type="FaListAlt" />图片
          </div>
            </div>
          </Card>
        </WingBlank>
      </div>
    }
  }</Observer >
}