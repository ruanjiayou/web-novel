import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { TabBar } from 'antd-mobile'
import { useRouterContext } from 'contexts/router'
import MIconView from 'components/MIconView'

import config from 'config'
import store from 'global-state'

export default function ({ children }) {
  let router = useRouterContext()
  return <Observer>
    {() => {
      if (router.hideMenu) {
        return children
      } else {
        return <Fragment>
          <TabBar
            tintColor="#33A3F4"
            unselectedTintColor="#888"
            tabBarPosition="bottom"
            barTintColor="white"
          >
            {config.menus.map(menu => {
              return <TabBar.Item
                title={menu.title}
                key={menu.name}
                icon={<MIconView style={{ margin: -5 }} type={menu.icon} />}
                selectedIcon={<MIconView style={{ marginBottom: -5 }} type={menu.icon} />}
                selected={menu.name === store.app.selectedMenu}
                onPress={() => {
                  store.app.setMenu(menu.name)
                  router.pushView(menu.path, null, { title: menu.title, hideMenu: false })
                }}
              >
                {children}
              </TabBar.Item>
            })}
          </TabBar>
        </Fragment>
      }
    }}
  </Observer>
}