import React, { Fragment } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useNaviContext, useRouterContext } from 'contexts'
import GroupTreeLoader from 'loader/GroupTreeLoader'
import { RenderGroups } from 'group'

export default function GroupTreePage() {
  const loader = GroupTreeLoader.create()
  const router = useRouterContext()
  const store = useLocalStore(() => ({
    title: router.getStateKey('title')
  }))
  const Navi = useNaviContext()
  const params = router.params
  useEffectOnce(() => {
    if (loader.isEmpty) {
      loader.refresh({ params: { group_id: params.group_id } })
    }
  })
  return <Observer>{() => (
    <Fragment>
      <Navi title={store.title} router={router} />
      <RenderGroups loader={loader} />
    </Fragment>
  )}</Observer>
}