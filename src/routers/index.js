import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import React from 'react';
import { Observer } from 'mobx-react-lite';
import { useProvider } from '../contexts/routerContext';

import store from '../global-state';
import storage from '../utils/storage';
import Locker from '../components/Locker';

import LayoutNormal from 'Layout/Normal';

import pages from 'pages';
import Login from 'pages/Auth/Login'

// 路由=>组件.没登录跳到登录.登录了匹配root.匹配失败就重定向route.

function App(props) {
  // props: history, location, match, staticContext
  const [router, RouterContext] = useProvider(props.history, props.location);
  return <RouterContext.Provider value={router}>
    <Switch>
      <Route path={'/root/*'} component={AppRoot}></Route>
      <Route path={'/auth/login'} component={Login}></Route>
      <Route component={NoMatch}></Route>
    </Switch>
  </RouterContext.Provider>;
}

function AppRoot(props) {
  // 默认是home
  const name = props.location.pathname.split('/').pop();
  if (store.app.selectedMenu !== name) {
    store.app.setMenu(name);
  }
  return <Observer>
    {() => {
      if (isLogin()) {
        if (store.app.config.isLockerOpen && store.app.config.isLockerLocked) {
          return <Locker />;
        }
        return <LayoutNormal>
          {pages.map(page => <Route key={page.pathname} path={page.pathname} component={page.component}></Route>)}
        </LayoutNormal>;
      } else {
        return <Redirect to={'/auth/login'}></Redirect>;
      }
    }}
  </Observer>;

}

function NoMatch({ location }) {
  if (isLogin()) {
    return <Redirect to={'/root/home'}></Redirect>;
  } else {
    return <Redirect to={'/auth/login'}></Redirect>;
  }
  // return <div>NoMatch</div>;
}

function isLogin() {
  let token = storage.getValue('access-token');
  return !!token;
}

export default function Index() {
  return <BrowserRouter basename={'/'}>
    <Route path={'/'} component={App}></Route>
  </BrowserRouter>;
};