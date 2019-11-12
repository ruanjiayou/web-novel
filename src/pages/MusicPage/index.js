import React from 'react'
import { useEffectOnce } from 'react-use'
import { Observer } from 'mobx-react-lite'
import { useNaviContext } from 'contexts/navi'
import { useRouterContext } from 'contexts/router'
import { useStoreContext } from 'contexts/store'
import { useMusicPlayerContext } from 'contexts/music'
import SongSheetLoader from 'loader/SongSheetLoader'
import SongListLoader from 'loader/SongListLoader'
import LoaderListView from 'components/LoaderListView'
import SongSheetItemView from 'business/SongSheetItemView'

import SongItemView from 'business/SongItemView'
import SongAddItemView from 'business/SongItemView/AddItemView'
import events from 'utils/events'

export default ({ self, children }) => {
  const gStore = useStoreContext()
  const Navi = useNaviContext()
  const router = useRouterContext()
  const loader = SongSheetLoader.create()
  const songListLoader = SongListLoader.create()
  const MusicPlayer = useMusicPlayerContext()
  const musicStore = gStore.music
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
        <Navi title="音乐" router={router} />
        <div className="full-height-auto">
          <LoaderListView
            loader={loader}
            renderItem={(item, selectionId, index) => (
              <SongSheetItemView item={item} selectionId={selectionId} router={router} />
            )}
          />
        </div>
        <div className="full-height-auto">
          <LoaderListView
            loader={songListLoader}
            renderItem={(item) => (
              <SongAddItemView item={item} router={router} />
            )}
          />
        </div>
        <div>
          <MusicPlayer />
        </div>
      </div>
    )}
  </Observer>

}