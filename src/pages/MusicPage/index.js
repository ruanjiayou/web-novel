import React from 'react'
import { useEffectOnce } from 'react-use'
import { Observer } from 'mobx-react-lite'
import { useNaviContext, useRouterContext } from 'contexts'
import SongSheetLoader from 'loader/SongSheetLoader'
import SongListLoader from 'loader/SongListLoader'
import { LoaderListView } from 'components'
import SongItemOnSheet from 'business/ResourceItem/SongItemOnSheet'

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
        <Navi title="音乐" router={router}>
          <span onClick={e => router.pushView('/root/music-songs')}>全部歌曲</span>
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