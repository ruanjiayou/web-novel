import React from 'react'
import { destroy, types } from 'mobx-state-tree'
import ViewModel from 'models/ViewModel'
import { views } from 'pages'
import services from 'services'
import _ from 'lodash'
import { useRouterContext, useStoreContext, useNaviContext } from 'contexts'

function generate_group_id() {
  return Math.random() + '';
}

const BaseViewModel = types.model({
  group_id: types.optional(types.string, generate_group_id),
  view: types.maybe(types.string),
  name: types.maybe(types.string),
  title: types.optional(types.string, ''),
  desc: types.maybe(types.string),
  envType: types.maybe(types.string),
  children: types.array(types.late(() => ViewModel)),
  attrs: types.model({
    hide_title: types.maybe(types.boolean),
    allowChange: types.maybe(types.boolean),
    selected: types.maybe(types.boolean),
    timeout: types.maybe(types.number),
    columns: types.maybe(types.number),
    showCount: types.maybe(types.number),
  }),
}).actions(self => ({
  removeChild(item) {
    destroy(item);
  }
})).views(self => ({
  get childrenViews() {
    if (self.children) {
      return self.children.map(child => <child.Component key={child.id} />)
    }
  },
})).views(self => {
  return {
    Comp(children, ...props) {
      const router = useRouterContext();
      const store = useStoreContext();
      const Navi = useNaviContext();
      let view = self.view;
      // 这个就是写的页面了，挂载self！！！！
      let Component = views.get(view);
      const query = router.getQuery()
      const params = query[view] || {};
      if (Component) {
        return <Component
          self={self}
          services={services}
          router={router}
          store={store}
          Navi={Navi}
          params={params}
          {...props}>
          {children}
        </Component>
      } else {
        return <div>模块正在开发中...</div>
      }
    }
  }
})

// 为view创建基本的分组属性
export default function CreateModel(props) {
  return BaseViewModel.props(props);
}