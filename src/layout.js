import React, { Fragment, useState } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { TabBar } from 'antd-mobile'
import { useRouterContext, useStoreContext } from 'contexts'
import { MIconView } from 'components'
import { isIOSafariWeb } from './utils/utils'
export default function ({ children }) {
  const router = useRouterContext()
  const store = useStoreContext()
  const [h] = useState(isIOSafariWeb() ? 80 : 0)
  return <Observer>{() => <div style={{ position: 'relative',  width: '100%', height: `calc(100vh - ${h}px)` }}>
    <TabBar
      tintColor="#33A3F4"
      unselectedTintColor="#555"
      tabBarPosition="bottom"
      barTintColor="white"
      hidden={store.app.hideMenu}
    >
      {store.app.tabs.map(menu => {
        return <TabBar.Item
          title={menu.big ? '' : menu.title}
          key={menu.name}
          icon={<MIconView style={menu.big ? { marginTop: -20, zIndex: 2, fontSize: '3rem' } : { margin: 3 }} type={menu.icon} />}
          selectedIcon={<MIconView style={{ margin: 3 }} type={menu.icon} />}
          selected={menu.name === store.app.selectedMenu}
          onPress={() => {
            if (menu.name === store.app.selectedMenu) {
              return
            }
            store.app.setMenu(menu.name)
            router.replaceView(menu.name, menu.name === 'home' ? { tab: store.app.tab } : {})
          }}
        >
          {children}
        </TabBar.Item>
      })}
    </TabBar>
  </div>}</Observer>
}