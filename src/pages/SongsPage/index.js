import React from 'react'
import { useEffectOnce } from 'react-use'
import { Observer } from 'mobx-react-lite'
import { LoaderListView } from 'components'
import { useNaviContext, useRouterContext } from 'contexts'
import SongSheetLoader from 'loader/SongSheetLoader'
import ResourceListLoader from 'loader/ResourceListLoader'
import ResourceItem from 'business/ResourceItem'

export default ({ self, children }) => {
  const Navi = useNaviContext()
  const router = useRouterContext()
  const loader = SongSheetLoader.create()
  const resourceListLoader = ResourceListLoader.create()
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