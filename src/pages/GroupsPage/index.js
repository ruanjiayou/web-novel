import React from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useEffectOnce } from 'react-use'

import { GroupListLoader } from 'loader'
import { AutoCenterView, EmptyView } from 'components'
import createPageModel from 'page-group-loader-model/BasePageModel'
import { Cell, Icon } from './style'

const model = createPageModel({
  GroupListLoader,
})

function View({ self, router, }) {
  useEffectOnce(() => {
    if (self.GroupListLoader.isEmpty) {
      self.GroupListLoader.refresh()
    }
  })
  return <Observer>{() => (
    <div className="full-height">
      <div style={{ padding: 10, backgroundColor: 'gainsboro', marginBottom: 10 }}>所有频道</div>
      <div className="full-height-auto">{
        self.GroupListLoader.isEmpty ? <AutoCenterView>{EmptyView(self.GroupListLoader)}</AutoCenterView> : (
          self.GroupListLoader.items.map(group => (
            <Cell
              key={group.id}
              onClick={() => {
                router.pushView(`GroupTree`, { name: group.name })
              }}>
              <Icon />
              <div>{group.title}</div>
            </Cell>
          ))
        )
      }</div>
    </div>
  )}</Observer>
}

export default {
  group: {
    view: 'groups',
  },
  View,
  model,
}