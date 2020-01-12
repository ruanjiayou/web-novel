import React, { Fragment } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useNaviContext, useRouterContext, useStoreContext } from 'contexts'
import GroupTreeLoader from 'loader/GroupTreeLoader'
import ResourceListLoader from 'loader/ResourceListLoader'
import { RenderGroups } from 'group'

export default function GroupTreePage() {
  const router = useRouterContext()
  const params = router.params
  const gStore = useStoreContext()
  const store = useLocalStore(() => ({
    title: router.getStateKey('title'),
    loader: gStore.channelLoaders[params.name] || GroupTreeLoader.create(),
    subLoader: gStore.resourceListLoaders[params.name] || ResourceListLoader.create()
  }))
  if (!gStore.channelLoaders[params.name]) {
    gStore.channelLoaders[params.name] = store.loader
  }
  useEffectOnce(() => {
    if (store.loader.state === 'init') {
      store.loader.refresh({ params: { name: params.name } }).then(() => {
        const query = store.loader.getQuery()
        if (store.subLoader.state === 'init') {
          store.subLoader.refresh({ query })
        }
      })
    }
  }, [store])
  const Navi = useNaviContext()
  return <Observer>{() => (
    <div className="full-height">
      <Navi title={store.title} router={router} />
      <div className="full-height-auto">
        <RenderGroups loader={store.loader} subLoader={store.subLoader} />
      </div>
    </div>)
  }</Observer>
}