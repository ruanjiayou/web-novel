import React, { Fragment } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'

import { SongSheetSongLoader } from 'loader'
import { LoaderListView, MIconView } from 'components'
import SongItem from 'business/ResourceItem/SongItem'
import createPageModel from 'page-group-loader-model/BasePageModel'

const model = createPageModel({
  SongSheetSongLoader,
})

function View({ self, router, store, services, Navi }) {
  const loader = self.SongSheetSongLoader
  const local = useLocalStore(() => ({
    title: router.getStateKey('title')
  }))
  useEffectOnce(() => {
    if (loader.isEmpty) {
      loader.refresh({ params: { id: router.params.id } })
    }
  })
  return <Observer>{() => (
    <Fragment>
      <Navi title={local.title} router={router} />
      <MIconView style={{ justifyContent: 'start' }} type="FaPlay" after={'播放全部'} onClick={() => {
        local.music.setSheet(loader.items)
        local.music.playMusic(loader.items.length ? loader.items[0].id : '')
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

export default {
  group: {
    view: 'SongSheet',
  },
  View,
  model,
}