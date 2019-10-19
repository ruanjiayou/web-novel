import React from 'react'
import { Observer } from 'mobx-react-lite'
import renderEmptyView from 'components/EmptyView'
import AutoCenterView from 'components/AutoCenterView'
import Filter from './Filter'
import FilterRow from './FitlerRow'
import FilterTag from './FilterTag'
const views = {
  'filter': Filter,
  'filter-row': FilterRow,
  'filter-tag': FilterTag,
  view(name) {
    if (this[name]) {
      return this[name]
    }
  }
}

export default function RenderGroups({ loader }) {
  const emptyView = renderEmptyView(loader)
  return <Observer>{() => {
    if (loader.item && loader.item.children) {
      return <div>{loader.item.children.map(g => {
        let View = views.view(g.view)
        if (View) {
          return <View self={g} key={g.id} />
        } else {
          return null
        }
      })}</div>
    } else {
      return <AutoCenterView>{emptyView}</AutoCenterView>
    }
  }}</Observer>
}