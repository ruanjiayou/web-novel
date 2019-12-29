import React, { Fragment } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useNaviContext, useRouterContext, useStoreContext } from 'contexts'
import GroupTreeLoader from 'loader/GroupTreeLoader'
import { RenderGroups } from 'group'

export default function GroupTreePage() {
  const router = useRouterContext()
  const params = router.params
  const gStore = useStoreContext()
  const store = useLocalStore(() => ({
    title: router.getStateKey('title'),
    loader: gStore.channelsLoader[params.name] || GroupTreeLoader.create()
  }))
  if (!gStore.channelsLoader[params.name]) {
    gStore.channelsLoader[params.name] = store.loader
  }
  useEffectOnce(() => {
    if (store.loader.isEmpty) {
      store.loader.refresh({ params: { name: params.name } })
    }
  }, [store])
  const Navi = useNaviContext()
  return <Observer>{() => (
    <div className="full-height">
      <Navi title={store.title} router={router} />
      <div className="full-height-auto">
        <RenderGroups loader={store.loader} />
      </div>
    </div>)
  }</Observer>
}