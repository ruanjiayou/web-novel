import React from 'react'
import { useEffectOnce } from 'react-use'
import { Observer } from 'mobx-react-lite'

import { SongSheetLoader } from 'loader'
import { LoaderListView } from 'components'
import SongItemOnSheet from 'business/ResourceItem/SongItemOnSheet'
import createPageModel from 'page-group-loader-model/BasePageModel'

const model = createPageModel({
  SongSheetLoader,
})

function View({ self, router, Navi, children }) {
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
          <span onClick={e => router.pushView('Music')}>全部歌曲</span>
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

export default {
  group: {
    view: 'Music',
  },
  View,
  model,
}