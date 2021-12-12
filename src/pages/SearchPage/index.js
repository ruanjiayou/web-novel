import React, { Fragment, useCallback, useRef } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import createPageModel from 'page-group-loader-model/BasePageModel'
import { FullHeight, FullHeightFix, FullHeightAuto, FullWidth, FullWidthAuto } from 'components/common';
import { useRouterContext } from 'contexts';
import { useEffectOnce } from 'react-use';
import storage from 'utils/storage'
import { WordItem } from './style'

const model = createPageModel({
})

function View({ self, store }) {
  const router = useRouterContext()
  const local = useLocalStore(() => ({
    hotWords: [],
    historyWords: [],
  }))
  const iRef = useRef(null)
  useEffectOnce(() => {
    const words = storage.getValue('historyWords') || '';
    local.historyWords = words.split(',').filter(w => w !== '')
    return () => {

    }
  })
  return <Observer>{() => <FullHeight>
    <FullWidth style={{ height: 50, }}>
      <FullWidthAuto style={{ marginLeft: 10 }}>
        <input autoFocus ref={ref => iRef.current = ref} style={{ height: 30, backgroundColor: '#ccc', border: '0 none', width: '100%', boxSizing: 'border-box', padding: '5px 8px', borderRadius: 5, }}
          onKeyDown={e => {
            if (e.keyCode === 13) {
              const str = iRef.current ? iRef.current.value : '';
              if (str) {
                local.historyWords.push(str);
                storage.setValue('historyWords', local.historyWords.join(','))
              }
              router.replaceView('SearchResult', { title: str })
            }
          }}
        />
      </FullWidthAuto>
      <div style={{ color: '#3e3e3e', padding: '0 5px' }} onClick={() => { router.back() }}>取消</div>
    </FullWidth>
    <FullHeightAuto style={{ padding: '0 10px' }}>
      <p>热门搜索</p>

      <p>搜索历史</p>
      <div>
        {local.historyWords.map(word => (<WordItem key={word} onClick={() => { router.replaceView('SearchResult', { title: word }) }}>{word}</WordItem>))}
      </div>
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