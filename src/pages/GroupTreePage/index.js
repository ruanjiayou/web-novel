import React, { Fragment } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'

import { RenderGroups } from 'group'
import { GroupTreeLoader, ResourceListLoader } from 'loader'
import createPageModel from 'page-group-loader-model/BasePageModel'

const model = createPageModel({
  GroupTreeLoader,
  ResourceListLoader,
})

function View({ self, router, store, params, Navi }) {
  const loader = self.GroupTreeLoader
  const subLoader = self.ResourceListLoader
  useEffectOnce(() => {
    if (loader.state === 'init') {
      loader.refresh({ params: { name: params.name } }).then(() => {
        const query = loader.getQuery()
        if (subLoader.state === 'init') {
          subLoader.refresh({ query })
        }
      })
    }
  }, [])
  return <Observer>{() => (
    <div className="full-height">
      <Navi title={params.title} router={router} />
      <div className="full-height-auto">
        <RenderGroups loader={loader} subLoader={subLoader} />
      </div>
    </div>)
  }</Observer>
}

export default {
  group: {
    view: 'GroupTree',
  },
  View,
  model,
}