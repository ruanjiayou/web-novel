import React, { Fragment, useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'

import { RenderGroups } from 'group'
import { GroupTreeLoader, ResourceListLoader } from 'loader'
import createPageModel from 'page-group-loader-model/BasePageModel'
import { useEffectOnce } from 'react-use'
import { EmptyView } from 'components'

const model = createPageModel({
  GroupTreeLoader,
  ResourceListLoader,
})

function View({ self, router, store, params, Navi }) {
  const local = useLocalStore(() => ({
    loader: GroupTreeLoader.create()
  }))
  const loader = local.loader
  useEffectOnce(() => {
    loader.refresh({ params: { name: params.name } })
  }, [])
  return <Observer>{() => {
    const Blank = EmptyView(local.loader, null, () => {
      loader.refresh({ params: { name: params.name } })
    })
    if (Blank) {
      return Blank
    }
    return <div className="full-height">
      <Navi title={loader.item.title} wrapStyle={{ paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right' }} router={router} />
      <div className="full-height-auto" style={{ paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right' }}>
        <RenderGroups loader={loader} />
      </div>
    </div>
  }}</Observer>
}

export default {
  group: {
    view: 'GroupTree',
  },
  View,
  model,
}