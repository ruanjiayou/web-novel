import React, { useEffect } from 'react'
import { Observer } from 'mobx-react-lite'
import { ActivityIndicator } from 'antd-mobile'
import MIconView from 'components/MIconView'
import { useStoreContext } from 'contexts/store'
import { useRouterContext } from 'contexts/router'

export default function () {
  const store = useStoreContext()
  const router = useRouterContext()
  const userLoader = store.userLoader
  useEffect(() => {
    if (userLoader.isEmpty) {
      // userLoader.refresh()
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
          <div className="full-width-auto" style={{ paddingLeft: 10 }}>{userLoader.isEmpty ? '---' : userLoader.item.name}</div>
          <div style={{ color: 'green' }}>
            <MIconView type="FaQrcode" />
          </div>
          {/* TODO: 个人信息页面 */}
          <div className="full-width-fix" onClick={() => router.pushView('/root/user-setting', null)}><MIconView type="FaAngleRight" /></div>
        </div>
        <div className="dd-common-alignside" style={{ padding: '10px 50px' }}>
          <div>
            <MIconView type="FaStar" />收藏
          </div>
          <div>
            <MIconView type="FaHistory" />历史
          </div>
          <div>
            <MIconView type="FaEllipsisV" />其他
          </div>
        </div>
        <div className="dd-common-alignside" style={{ padding: '10px 50px' }}>
          <div onClick={() => router.pushView('/root/secure', null, { title: '安全' })}>
            <MIconView type="FaLock" />安全
          </div>
          <div onClick={() => window.location.reload()}>
            <MIconView type="FaSyncAlt" />刷新
          </div>
          <div onClick={() => router.pushView('/root/category', null, { hideMenu: true })}>
            <MIconView type="FaListAlt" />分类
          </div>
        </div>
      </div>
    }
  }</Observer >
}