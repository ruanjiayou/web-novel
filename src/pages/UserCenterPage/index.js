import React, { useEffect } from 'react'
import { Observer } from 'mobx-react-lite'
import { ActivityIndicator } from 'antd-mobile'
import MIconView from 'components/MIconView'
import { useStoreContext } from 'contexts/store'
import { useRouterContext } from 'contexts/router'
import { useNaviContext } from 'contexts/navi'

export default function () {
  const store = useStoreContext()
  const router = useRouterContext()
  const Navi = useNaviContext()
  const userLoader = store.userLoader
  useEffect(() => {
    if (userLoader.isEmpty) {
      userLoader.refresh()
    }
  })
  return <Observer>{
    () => {
      return <div className="full-height">
        <ActivityIndicator animating={userLoader.isLoading} />
        <Navi title="我的" />
        <div className="full-width" style={{ padding: '0 20px' }}>
          <div className="full-width-fix">
            {/* TODO: 测试 */}
            {/* <img src={userLoader.isEmpty ? '' : userLoader.item.avater} /> */}
            <img src="/logo.jpg" style={{ margin: '10px 20px', borderRadius: '50%' }} alt="" />
          </div>
          <div className="full-width-auto">{userLoader.isEmpty ? '---' : userLoader.item.name}</div>
          <div style={{ color: 'green' }}>
            <MIconView type="FaQrcode" />
          </div>
          {/* TODO: 个人信息页面 */}
          <div className="full-width-fix" onClick={() => router.pushView('/root/user-center/info', null)}><MIconView type="FaAngleRight" /></div>
        </div>
        <div className="dd-common-alignside" style={{ padding: '10px 40px' }}>
          <div>
            <MIconView type="FaStar" />收藏
          </div>
          <div>
            <MIconView type="FaHistory" />历史
          </div>
          <div onClick={() => router.pushView('/root/category', null, { hideMenu: true })}>
            <MIconView type="FaListAlt" />分类
          </div>
          <div>
            <MIconView type="FaEllipsisV" />其他
          </div>
        </div>
        <div className="dd-common-alignside" style={{ padding: '10px 40px' }}>
          <div onClick={() => router.pushView('/root/secure', null, { title: '安全' })}>
            <MIconView type="FaLock" />安全
          </div>
          <div onClick={() => router.pushView('/root/todo', null, { hideMenu: true })}>
            <MIconView type="FaTasks" />TODO
          </div>
        </div>
      </div>
    }
  }</Observer>
}