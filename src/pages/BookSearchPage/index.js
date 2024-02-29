import React, { useEffect } from 'react'
import { Observer } from 'mobx-react-lite'

import { RenderGroups } from 'group'
import { ResourceListLoader, GroupTreeLoader } from 'loader'
import { FullHeight, FullHeightAuto, FullHeightFix } from 'components/common'
import createPageModel from 'page-group-loader-model/BasePageModel'
import { UserAreaView } from 'components/index.js'

const model = createPageModel({
  ResourceListLoader,
  GroupTreeLoader,
})

function View({ self, router, Navi }) {
  const loader = self.GroupTreeLoader
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh({ params: { name: 'book-search-all' } })
    }
  })
  return <Observer>{
    () => <UserAreaView>
      <Navi title="全部" router={router} />
      <FullHeightAuto>
        <RenderGroups loader={loader} />
      </FullHeightAuto>
    </UserAreaView>}
  </Observer>
}

export default {
  group: {
    view: 'BookSearch',
  },
  View,
  model,
}