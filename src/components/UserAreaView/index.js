import React from 'react'
import { Observer } from 'mobx-react-lite'
import { isPWAorMobile } from 'utils/utils'
import { useStoreContext } from 'contexts'
import { FullHeight, FullHeightAuto, FullHeightFix } from 'components/common';

export default function UserAreaView({ children, top = 'env(safe-area-inset-top)', bottom = 'env(safe-area-inset-bottom)', bgcTop, bgcBot, bgc = '#eee', }) {
  const store = useStoreContext();
  return <Observer>{() => (
    <FullHeight style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      // height: 'calc(100% - env(safe-area-inset-bottom))',
      // boxSizing: 'border-box',
      // paddingTop: store.app.hideMenu ? 0 : 'env(safe-area-inset-top)',
      // paddingBottom: 0,
      // ...style,
    }}>
      <FullHeightFix style={{ height: top, backgroundColor: bgcTop || store.app.barBGC }}></FullHeightFix>
      <FullHeightAuto
        style={{
          position: 'relative',
          backgroundColor: bgc,
        }}
      >
        <FullHeight>
          {children}
        </FullHeight>
      </FullHeightAuto>
      <FullHeightFix style={{ height: bottom, backgroundColor: bgcBot }}></FullHeightFix>
    </FullHeight>
  )}</Observer>
}
