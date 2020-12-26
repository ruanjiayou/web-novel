import React, { Fragment, useCallback, useRef } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import createPageModel from 'page-group-loader-model/BasePageModel'
import { FullHeight, FullHeightFix, FullHeightAuto, FullWidth, FullWidthAuto } from 'components/common';
import { useRouterContext } from 'contexts';

const model = createPageModel({
})

function View({ self }) {
  const router = useRouterContext()
  const iRef = useRef(null)
  return <Observer>{() => <FullHeight>
    <FullWidth style={{ height: 50, marginLeft: 10 }}>
      <FullWidthAuto >
        <input autoFocus ref={ref => iRef.current = ref} style={{ height: 30, backgroundColor: '#ccc', border: '0 none', width: '100%', boxSizing: 'border-box', padding: '5px 8px', borderRadius: 5, }}
          onKeyDown={e => {
            if (e.keyCode === 13) {
              router.pushView('SearchResult', { title: iRef.current ? iRef.current.value : '' })
            }
          }}
        />
      </FullWidthAuto>
      <div style={{ color: '#ccc', margin: '0 5px' }} onClick={() => { router.back() }}>取消</div>
    </FullWidth>
    <FullHeightAuto>

    </FullHeightAuto>
  </FullHeight>}</Observer>
}


export default {
  group: {
    view: 'Search',
  },
  View,
  model,
}