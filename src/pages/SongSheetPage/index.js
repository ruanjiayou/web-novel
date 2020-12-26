import React, { Fragment } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'

import { SongSheetLoader } from 'loader'
import { LoaderListView, MIconView } from 'components'
import SongItem from 'business/ResourceItem/SongItem'
import createPageModel from 'page-group-loader-model/BasePageModel'
import store from '../../store'
import renderBlank from 'components/EmptyView';

const model = createPageModel({
  SongSheetLoader,
})

function View({ self, router, store, params, services, Navi }) {
  const loader = self.SongSheetLoader
  const music = store.music
  const local = useLocalStore(() => ({
    title: router.getStateKey('title'),
    loadedList: false,
  }))
  useEffectOnce(() => {
    if (loader.isEmpty) {
      loader.refresh({ params, }).then(() => {
        local.title = loader.item ? loader.item.title : ''
      })
    }
  })
  return <Observer>{() => {
    const blank = renderBlank(loader)
    if (blank) {
      return blank
    }
    return <Fragment>
      <Navi title={local.title} router={router} />
      <MIconView style={{ justifyContent: 'start' }} type="FaPlay" after={'播放全部'} onClick={() => {
        if (!local.loadedList) {
          music.loadList(loader.item.list);
        }
        if (loader.item.list.length) {
          music.playAll();
          router.pushView('MusicPlayer', { id: loader.item.list[0].id })
        }

      }} />
      <div className="full-height">
        {loader.item.list.map((item, index) => (
          <SongItem key={item.id} mode={'delete'} loader={loader} item={item} router={router} onClick={() => {
            if (!local.loadedList) {
              music.loadList(loader.item.list);
            }
            music.play(item)
            router.pushView('MusicPlayer', { id: item.id })
          }} />
        ))}
      </div>
    </Fragment>
  }}</Observer>
}

export default {
  group: {
    view: 'SongSheet',
  },
  View,
  model,
}