import React from 'react'
import { useEffectOnce } from 'react-use'
import { Observer } from 'mobx-react-lite'
import { LoaderListView } from 'components'
import { useNaviContext, useRouterContext } from 'contexts'
import ResourceItem from 'business/ResourceItem'
import loaders from 'loader'
import createPageModel from 'page-group-loader-model/BasePageModel'

export const ViewModel = createPageModel({
  SongSheetLoader: loaders.SongSheetLoader,
  ResourceListLoader: loaders.ResourceListLoader
})

export default ({ self, children }) => {
  const Navi = useNaviContext()
  const router = useRouterContext()
  const loader = self.SongSheetLoader
  const resourceListLoader = self.ResourceListLoader
  useEffectOnce(() => {
    if (loader.isEmpty) {
      loader.refresh()
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
              <ResourceItem mode="add" item={item} loader={resourceListLoader} />
            )}
          />
        </div>
      </div>
    )}
  </Observer>
}