import React, { Fragment } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useNaviContext } from 'contexts/navi'
import { useRouterContext } from 'contexts/router'
import { useStoreContext } from 'contexts/store'

import SongSheetSongLoader from 'loader/SongSheetSongLoader'
import LoaderListView from 'components/LoaderListView'
import SongItemView from 'business/SongItemView'
import MIconView from 'components/MIconView'
import services from 'services'

export default function SongSheetPage() {
  const Navi = useNaviContext()
  const router = useRouterContext()
  const gStore = useStoreContext()
  const loader = SongSheetSongLoader.create()
  const store = useLocalStore(() => ({
    title: router.getStateKey('title')
  }))
  useEffectOnce(() => {
    if (loader.isEmpty) {
      loader.refresh({ params: { id: router.params.id } })
    }
  })
  return <Observer>{() => (
    <Fragment>
      <Navi title={store.title} router={router} />
      <MIconView style={{ justifyContent: 'start' }} type="FaPlay" after={'播放全部'} onClick={() => {
        const items = loader.items.map(item => item.value)
        gStore.music.setSheet(items)
        loader.items[0].toggleStatus()
        gStore.music.playMusic(loader.items[0].url, 0)
      }} />
      <div className="full-height">
        <LoaderListView
          loader={loader}
          renderItem={(item, selectionId, index) => (
            <SongItemView mode={'delete'} item={item} router={router} remove={async (data) => {
              await services.removeSheetSong({ params: { id: data.id, ssid: data.ssid } })
              loader.remove(index)
            }} />
          )}
        />
      </div>
    </Fragment>
  )}</Observer>
}