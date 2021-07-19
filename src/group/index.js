import React, { useEffect } from 'react'
import { useMount } from 'react-use'
import { Observer } from 'mobx-react-lite'
import renderEmptyView from 'components/EmptyView'
import AutoCenterView from 'components/AutoCenterView'
import Filter from './Filter'
import FilterRow from './FitlerRow'
import FilterTag from './FilterTag'
import Picker from './Picker'
import TreeNode from './TreeNode'
import Tab from './Tab'
import TabPane from './TabPane'
import Random from './Random'

const views = {
  'filter': Filter,
  'filter-tag': FilterTag,
  'filter-row': FilterRow,
  'picker': Picker,
  'random': Random,
  'tab': Tab,
  'tab-pane': TabPane,
  'tree-node': TreeNode,
  view(name) {
    if (this[name]) {
      return this[name]
    }
  }
}

export function AutoView({ self, ...props }) {
  return <Observer>{() => {
    if (self === null) {
      return <div>null</div>
    }
    if (self.parent_id === '') {
      return self.children.map(child => (
        <AutoView key={child.id} self={child} {...props} />
      ))
    } else {
      let View = views.view(self.view)
      if (View) {
        return <View self={self} {...props} />
      } else {
        return <div>?</div>
      }
    }
  }
  }</Observer>
}
export function RenderGroups({ loader, group, params, ...props }) {
  const emptyView = renderEmptyView(loader)
  useMount(mount => {
    mount && mount()
    if (loader.state === 'init' && group) {
      loader.refresh({ params: { name: group.name } })
    }
  }, [])
  return <Observer>{() => {
    if (loader.isEmpty) {
      return <AutoCenterView>{emptyView}</AutoCenterView>
    } else {
      return <div style={{ height: '100%', overflow: 'auto' }}>
        <AutoView self={loader.item} loader={loader} {...props} />
      </div>
    }
  }}</Observer>
}