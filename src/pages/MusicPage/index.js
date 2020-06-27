import React from 'react'
import { useEffectOnce } from 'react-use'
import { Observer } from 'mobx-react-lite'
import { useNaviContext, useRouterContext } from 'contexts'
import { LoaderListView } from 'components'
import SongItemOnSheet from 'business/ResourceItem/SongItemOnSheet'
import loaders from 'loader'
import createPageModel from 'page-group-loader-model/BasePageModel'

export const ViewModel = createPageModel({
  SongSheetLoader: loaders.SongSheetLoader
})

export default ({ self, children }) => {
  const Navi = useNaviContext()
  const router = useRouterContext()
  const loader = self.SongSheetLoader
  useEffectOnce(() => {
    if (loader.isEmpty) {
      loader.refresh()
    }
  })
  return <Observer>
    {() => (
      <div className="full-height">
        <Navi title="音乐" router={router}>
          <span onClick={e => router.pushView('music-songs')}>全部歌曲</span>
        </Navi>
        <div className="full-height-auto">
          <LoaderListView
            loader={loader}
            renderItem={(item, selectionId, index) => (
              <SongItemOnSheet key={index} item={item} selectionId={selectionId} router={router} />
            )}
          />
        </div>
      </div>
    )}
  </Observer>

}