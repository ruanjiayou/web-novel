import React, { useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useEffectOnce } from 'react-use'

import { GalleryLoader } from 'loader'
import { AutoCenterView, EmptyView } from 'components'
import { FullHeight, FullHeightAuto, FullHeightFix } from 'components/common'
import createPageModel from 'page-group-loader-model/BasePageModel'

const model = createPageModel({
  GalleryLoader,
})

function View({ self, store, router, params, Navi, }) {
  let imageHost = store.lineLoader.getHostByType('image')
  useEffect(() => {
    self.GalleryLoader.refresh({ params })
    return () => {
      self.GalleryLoader.clear()
    }
  }, [params.id])
  return <Observer>{() => {
    const blank = EmptyView(self.GalleryLoader)
    if (blank) {
      return blank
    }
    return <FullHeight>
      <Navi title={self.GalleryLoader.item.title} router={router} />
      <FullHeightAuto>
        {self.GalleryLoader.item.images.map(image => (
          <img src={imageHost + image} key={image} style={{ width: '100%' }} />
        ))
        }
      </FullHeightAuto>
      <FullHeightFix>
        {self.GalleryLoader.item.next && <div onClick={() => { router.replaceView('ComicGallery', { bid: self.GalleryLoader.item.next.bid, id: self.GalleryLoader.item.next.id }) }}>{self.GalleryLoader.item.next.title}</div>}
      </FullHeightFix>
    </FullHeight>
  }}</Observer>
}

export default {
  group: {
    view: 'ComicGallery',
  },
  View,
  model,
}