import React from 'react'
import { Observer } from 'mobx-react-lite'
import renderEmptyView from 'components/EmptyView'
import AutoCenterView from 'components/AutoCenterView'
import Filter from './Filter'
import FilterRow from './FitlerRow'
import FilterTag from './FilterTag'
import Picker from './Picker'
const views = {
  'picker': Picker,
  'filter': Filter,
  'filter-row': FilterRow,
  'filter-tag': FilterTag,
  view(name) {
    if (this[name]) {
      return this[name]
    }
  }
}

function AutoView({ self, ...props }) {
  return <Observer>{() => {
    if (self.parent_id === '') {
      return self.children.map(child => (
        <AutoView key={child.group_id} self={child} {...props} />
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
export default function RenderGroups({ loader }) {
  const emptyView = renderEmptyView(loader)
  return <Observer>{() => {
    if (loader.item && loader.item.children.length !== 0) {
      return <div style={{ height: '100%', overflow: 'auto' }}>
        <AutoView self={loader.item} />
      </div>
    } else {
      return <AutoCenterView>{emptyView}fucik</AutoCenterView>
    }
  }}</Observer>
}