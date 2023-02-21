import React from 'react'
import { Observer } from 'mobx-react-lite'
import { isPWAorMobile } from 'utils/utils'
import { useStoreContext } from 'contexts'
import { FullHeight, FullHeightAuto } from 'components/common';

export default function UserAreaView({ children, className, style, bar }) {
  const store = useStoreContext();
  return <Observer>{() => (
    <FullHeight style={{
      backgroundColor: store.app.barBGC,
      paddingTop: store.app.hideMenu ? 0 : 'env(safe-area-inset-top)',
      marginBottom: store.app.hideMenu ? 0 : 'env(safe-area-inset-bottom)',
    }}>
      <FullHeightAuto
        style={{
          position: 'relative',
          backgroundColor: 'white',
        }}
      >
        {children}
      </FullHeightAuto>
    </FullHeight>
  )}</Observer>
}
