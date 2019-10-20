import React, { Fragment } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useNaviContext } from 'contexts/navi'
import { useRouterContext } from 'contexts/router'
import GroupTreeLoader from 'loader/GroupTreeLoader'
import GroupTree from 'components/GroupTree'

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
      <Navi title={store.title} />
      <GroupTree
        loader={loader}
      />
    </Fragment>
  )}</Observer>
}