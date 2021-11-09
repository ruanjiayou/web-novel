import React, { useEffect } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'

import { MIconView } from 'components'
import { FullHeight, FullWidth, FullHeightAuto, } from 'components/common'
import createPageModel from 'page-group-loader-model/BasePageModel'
import showTip from 'utils/showTip';

const model = createPageModel({})

function View({ self, router, store, params }) {
  const local = useLocalStore(() => ({}))
  useEffectOnce(() => {

  })
  return <Observer>
    {() => (
      <FullHeight style={{ position: 'relative' }}>
        <div style={{ width: 40, height: 40, position: 'absolute', left: 10, top: 10, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => { router.back() }}></div>
        <div>TODO:</div>
      </FullHeight>
    )}
  </Observer>
}

export default {
  group: {
    view: 'awhile',
  },
  model,
  View,
}