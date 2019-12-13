import React, { Fragment, useEffect } from 'react'
import { Observer } from 'mobx-react-lite'
import { useNaviContext } from 'contexts/navi'
import { useRouterContext } from 'contexts/router'
import 'components/common.css'

import LoaderListView from 'components/LoaderListView'
import ImageListLoader from 'loader/ImageListLoader'
import ImageItem from 'business/ResourceItem/ImageItem'
import GroupTreeLoader from 'loader/GroupTreeLoader'
import { RenderGroups } from 'group'

export default function () {
  const Navi = useNaviContext()
  const router = useRouterContext()
  const loader = GroupTreeLoader.create()
  const imagesLoader = ImageListLoader.create()
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh({ params: { group_id: 'D5698713D07045ADBBF5F0D5D09E53E4' } })
    }
    if (imagesLoader.isEmpty) {
      imagesLoader.refresh()
    }
  })
  return <Observer>{
    () => <Fragment>
      <Navi title="全部" router={router} />
      <div className="full-height-auto" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div>
          <RenderGroups loader={loader} onQueryChange={query => {
            imagesLoader.refresh({ query })
          }} />
        </div>
        <div style={{ flex: 1 }}>
          <LoaderListView
            loader={imagesLoader}
            renderItem={(item, selectionId, index) => <ImageItem
              item={item}
              router={router}
              selectionId={selectionId}
            />}
          />
        </div>
      </div>
    </Fragment>}
  </Observer>
}