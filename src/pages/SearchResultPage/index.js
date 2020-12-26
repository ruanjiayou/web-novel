import React, { Fragment, useCallback, useRef, useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Tabs } from 'antd-mobile'
import { ResourceListLoader } from 'loader'
import renderBlank from 'components/EmptyView';
import { LoaderListView, MIconView } from 'components';
import ResourceItem from 'business/ResourceItem'
import { useEffectOnce } from 'react-use';
import createPageModel from 'page-group-loader-model/BasePageModel'
import { FullHeight, FullHeightFix, FullHeightAuto, FullWidth, FullWidthAuto, FullWidthFix } from 'components/common';
import { useNaviContext, useRouterContext } from 'contexts';

const model = createPageModel({
  resources: ResourceListLoader,
})

function View({ self, params }) {
  const router = useRouterContext()
  const loader = self.resources
  const iRef = useRef(null)
  useEffect(() => {
    if (loader.isEmpty) {
      loader.setOption({ query: { title: params.title } })
      loader.refresh({})
    }
  }, [params.title])
  return <Observer>{() => <FullHeight>
    <FullWidth style={{ height: 50, marginLeft: 10 }}>
      <FullWidthFix>
        <MIconView type="FaAngleLeft" style={{}} onClick={() => router.back()} />
      </FullWidthFix>
      <FullWidthAuto>
        <input autoFocus
          ref={ref => iRef.current = ref}
          defaultValue={params.title || ''}
          onKeyDown={e => {
            if (e.keyCode === 13) {
              router.replaceView('SearchResult', { title: iRef.current ? iRef.current.value : '' })
              loader.refresh({ query: { title: iRef.current ? iRef.current.value : '' } })
            }
          }} style={{ height: 30, backgroundColor: '#ccc', border: '0 none', width: '100%', boxSizing: 'border-box', padding: '5px 8px', borderRadius: 5, }} />
      </FullWidthAuto>
      <div style={{ color: '#ccc', margin: '0 5px' }} onClick={() => { loader.refresh({ query: { title: iRef.current ? iRef.current.value : '' } }) }}>搜索</div>
    </FullWidth>
    <FullHeightAuto>
      <LoaderListView
        loader={loader}
        renderItem={item => <ResourceItem key={item.id} item={item} loader={loader} />}
      />
    </FullHeightAuto>
  </FullHeight>}</Observer>
}


export default {
  group: {
    view: 'SearchResult',
  },
  View,
  model,
}