import React from 'react'
import { useEffectOnce } from 'react-use'
import { Observer } from 'mobx-react-lite'

import { LoaderListView } from 'components'
import SongItem from 'business/SongItem'
import { SongSheetLoader, ResourceListLoader } from 'loader'
import createPageModel from 'page-group-loader-model/BasePageModel'

const model = createPageModel({
  SongSheetLoader,
  ResourceListLoader,
})

function View({ self, router, Navi, children }) {
  const loader = self.SongSheetLoader
  const resourceListLoader = self.ResourceListLoader
  useEffectOnce(() => {
    if (loader.isEmpty) {
      // loader.refresh()
    }
    if (resourceListLoader.isEmpty) {
      resourceListLoader.refresh({ query: { source_type: 'music' } })
    }
  })
  return <Observer>
    {() => (
      <div className="full-height">
        <Navi title="全部歌曲" router={router} />
        <div className="full-height-auto">
          <LoaderListView
            loader={resourceListLoader}
            refresh={() => {
              resourceListLoader.refresh({ query: { source_type: 'music' } })
            }}
            loadMore={() => {
              resourceListLoader.loadMore({ query: { source_type: 'music' } })
            }}
            renderItem={(item) => (
              <SongItem type="cover" more={true} item={item} loader={resourceListLoader} />
            )}
          />
        </div>
      </div>
    )}
  </Observer>
}

export default {
  group: {
    view: 'Song',
  },
  View,
  model,
}