import React, { useEffect } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { TabBar } from 'antd-mobile';
import { useRouterContext, useStoreContext } from 'contexts';
import { MIconView, UserAreaView } from 'components';

export default function ({ children }) {
  const router = useRouterContext();
  const store = useStoreContext();
  const local = useLocalStore(() => ({
    safeTopBGC: '',
    selectedMenu: 'home',
  }));

  useEffect(() => {
    const name = router.history.location.pathname.split('/')[2].split('?')[0];
    if (!local.selectedMenu) {
      local.selectedMenu = 'home';
    } else {
      local.selectedMenu = name;
    }
    if (local.selectedMenu === 'home') {
      local.safeTopBGC = '#108ee9';
    }
    if (local.selectedMenu === 'groups') {
      local.safeTopBGC = 'rgb(150 159 169)';
    }
    if (local.selectedMenu === 'awhile') {
      local.safeTopBGC = 'transparent';
    }
    if (local.selectedMenu === 'music') {
      local.safeTopBGC = 'plum';
    }
    if (local.selectedMenu === 'mine') {
      local.safeTopBGC = '#eee';
    }
    // 沉浸式
  }, [router.history.location.pathname]);

  return (
    <Observer>
      {() => (
        <UserAreaView
          bgcTop={local.safeTopBGC}
          bgcBot={'#fff'}
          top={local.selectedMenu === 'awhile' ? 0 : 'env(safe-area-inset-top)'}
          bottom={
            local.selectedMenu === 'awhile' ? 0 : 'env(safe-area-inset-bottom)'
          }
        >
          <TabBar
            tintColor="#33A3F4"
            unselectedTintColor="#555"
            tabBarPosition="bottom"
            barTintColor="white"
            hidden={local.selectedMenu === 'awhile'}
          >
            {store.app.tabs.map((menu) => {
              const Comp = router.getPage(menu.name);
              return (
                <TabBar.Item
                  title={menu.big ? '' : menu.title}
                  key={menu.name}
                  icon={
                    <MIconView
                      style={
                        menu.big
                          ? { marginTop: -20, zIndex: 2, fontSize: '3rem' }
                          : { margin: 3 }
                      }
                      type={menu.icon}
                    />
                  }
                  selectedIcon={
                    <MIconView style={{ margin: 3 }} type={menu.icon} />
                  }
                  selected={menu.name === local.selectedMenu}
                  onPress={() => {
                    if (menu.name === local.selectedMenu) {
                      return;
                    }
                    store.app.setLastSelectMenu(local.selectedMenu)
                    local.selectedMenu = menu.name;
                    router.replaceView(menu.name, {});
                  }}
                >
                  <Comp />
                </TabBar.Item>
              );
            })}
          </TabBar>
        </UserAreaView>
      )}
    </Observer>
  );
}
