import React, { Fragment } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useNaviContext, useRouterContext, useStoreContext } from 'contexts'
import { RenderGroups } from 'group'
import createPageModel from 'page-group-loader-model/BasePageModel'
import loaders from 'loader/index'

export const ViewModel = createPageModel({
  GroupTreeLoader: loaders.GroupTreeLoader,
  ResourceListLoader: loaders.ResourceListLoader,
})

export default function GroupTreePage({ self, title = '' }) {
  const router = useRouterContext()
  const params = router.params
  const loader = self.GroupTreeLoader
  const subLoader = self.ResourceListLoader
  useEffectOnce(() => {
    if (loader.state === 'init') {
      loader.refresh({ params: { name: params.name } }).then(() => {
        const query = loader.getQuery()
        if (subLoader.state === 'init') {
          subLoader.refresh({ query })
        }
      })
    }
  }, [])
  const Navi = useNaviContext()
  return <Observer>{() => (
    <div className="full-height">
      <Navi title={title} router={router} />
      <div className="full-height-auto">
        <RenderGroups loader={loader} subLoader={subLoader} />
      </div>
    </div>)
  }</Observer>
}