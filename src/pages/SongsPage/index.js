import React from 'react'
import { useEffectOnce } from 'react-use'
import { Observer } from 'mobx-react-lite'
import { useNaviContext } from 'contexts/navi'
import { useRouterContext } from 'contexts/router'
import SongSheetLoader from 'loader/SongSheetLoader'
import SongListLoader from 'loader/SongListLoader'
import LoaderListView from 'components/LoaderListView'
import SongItemView from 'business/SongItemView'

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
              <SongItemView mode="add" item={item} router={router} />
            )}
          />
        </div>
      </div>
    )}
  </Observer>
}