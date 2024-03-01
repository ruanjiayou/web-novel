import React from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useEffectOnce } from 'react-use'

import { GroupListLoader } from 'loader'
import { AutoCenterView, EmptyView } from 'components'
import { FullHeight, FullHeightAuto, FullHeightFix } from 'components/common'
import createPageModel from 'page-group-loader-model/BasePageModel'
import { Cell, ChannelImage } from './style'

const model = createPageModel({
  GroupListLoader,
})

function View({ self, router, store }) {
  useEffectOnce(() => {
    if (self.GroupListLoader.isEmpty) {
      self.GroupListLoader.refresh()
    }
  })
  return <Observer>{() => {
    const blank = EmptyView(self.GroupListLoader)
    if (blank) {
      return blank
    }
    return <FullHeight>
      <div style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 'calc(env(safe-area-inset-left) + 10px )', paddingRight: 'calc(env(safe-area-inset-right) + 10px )' }}>所有频道</div>
      <FullHeightAuto>
        {self.GroupListLoader.items.map(group => (
          <Cell
            key={group.id}
            onClick={() => {
              router.pushView('GroupTree', { name: group.data.name })
            }}>
            <ChannelImage src={group.lineCover} alt="" />
            <div>{group.title}</div>
          </Cell>
        ))
        }
      </FullHeightAuto>
    </FullHeight>
  }}</Observer>
}

export default {
  group: {
    view: 'groups',
  },
  View,
  model,
}