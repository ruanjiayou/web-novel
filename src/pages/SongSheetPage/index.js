import React, { Fragment } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'

import { LoaderListView, MIconView } from 'components'
import { useNaviContext, useRouterContext, useStoreContext } from 'contexts'

import SongItem from 'business/ResourceItem/SongItem'
import services from 'services'
import loaders from 'loader'
import createPageModel from 'page-group-loader-model/BasePageModel'

export const ViewModel = createPageModel({
  SongSheetSongLoader: loaders.SongSheetSongLoader
})

export default function SongSheetPage({ self }) {
  const Navi = useNaviContext()
  const router = useRouterContext()
  const gStore = useStoreContext()
  const loader = self.SongSheetSongLoader
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
        gStore.music.setSheet(loader.items)
        gStore.music.playMusic(loader.items.length ? loader.items[0].id : '')
      }} />
      <div className="full-height">
        <LoaderListView
          loader={loader}
          renderItem={(item, selectionId, index) => (
            <SongItem mode={'delete'} order={index} item={item} loader={loader} router={router} remove={async (data) => {
              await services.removeSheetSong({ params: { id: data.id, ssid: data.ssid } })
              loader.remove(index)
            }} />
          )}
        />
      </div>
    </Fragment>
  )}</Observer>
}