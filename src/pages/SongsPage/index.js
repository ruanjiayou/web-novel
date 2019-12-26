import React from 'react'
import { useEffectOnce } from 'react-use'
import { Observer } from 'mobx-react-lite'
import { LoaderListView } from 'components'
import { useNaviContext, useRouterContext } from 'contexts'
import SongSheetLoader from 'loader/SongSheetLoader'
import SongListLoader from 'loader/SongListLoader'
import SongItem from 'business/ResourceItem/SongItem'

export default ({ self, children }) => {
  const Navi = useNaviContext()
  const router = useRouterContext()
  const loader = SongSheetLoader.create()
  const songListLoader = SongListLoader.create()
  useEffectOnce(() => {
    if (loader.isEmpty) {
      loader.refresh()
    }
    if (songListLoader.isEmpty) {
      songListLoader.refresh()
    }
  })
  return <Observer>
    {() => (
      <div className="full-height">
        <Navi title="全部歌曲" router={router} />
        <div className="full-height-auto">
          <LoaderListView
            loader={songListLoader}
            renderItem={(item) => (
              <SongItem mode="add" item={item} router={router} />
            )}
          />
        </div>
      </div>
    )}
  </Observer>
}