import React, { Fragment, useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'

import { RenderGroups } from 'group'
import { GroupTreeLoader, ResourceListLoader } from 'loader'
import createPageModel from 'page-group-loader-model/BasePageModel'
import { useEffectOnce } from 'react-use'
import { EmptyView, UserAreaView } from 'components'

const model = createPageModel({
  GroupTreeLoader,
  ResourceListLoader,
})

function View({ self, router, store, params, Navi, loader: nnn }) {
  const local = useLocalStore(() => ({
    loader: GroupTreeLoader.create(),
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
    return <UserAreaView bottom='0'>
      <Navi title={loader.item.title} router={router} />
      <div className="full-height-auto">
        <RenderGroups loader={loader} resourcesLoader={store.resourceListLoaders[loader.item.id]} />
      </div>
    </UserAreaView>
  }}</Observer>
}

export default {
  group: {
    view: 'GroupTree',
  },
  View,
  model,
}