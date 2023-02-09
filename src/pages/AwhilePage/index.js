import React, { useEffect } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'

import { MIconView, } from 'components'
import { FullHeight, AlignCenterXY, } from 'components/common'
import createPageModel from 'page-group-loader-model/BasePageModel'
import showTip from 'utils/showTip';

const model = createPageModel({})

function View({ self, router, store, params }) {
  const local = useLocalStore(() => ({}))
  useEffectOnce(() => {

  })
  return <Observer>
    {() => (
      <FullHeight style={{ position: 'relative', backgroundImage:'url(/logo.jpg)', backgroundSize: 'cover' }}>
        <AlignCenterXY style={{ width: 40, height: 40, color: 'white', position: 'absolute', left: 'calc(10px + env(safe-area-inset-left))', top: 'calc(10px + env(safe-area-inset-top))', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => { router.replaceView('home') }}>
          <MIconView type="FaChevronLeft" />
        </AlignCenterXY>
        <img src="/logo.jpg" style={{ width: '100%', height: '100%' }} />
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