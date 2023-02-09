import React from 'react'
import { Observer } from 'mobx-react-lite'
import { isPWAorMobile } from 'utils/utils'
import { useStoreContext } from 'contexts'

export default function UserAreaView({ children, className, style, bar }) {
  const store = useStoreContext();
  return <Observer>{() => (
    <div className="full-height" style={{ overflow: 'hidden', backgroundColor: store.app.barBGC }}>
      {!store.app.hideMenu && <div style={{ marginTop: 'env(safe-area-inset-top)' }}></div>}
      <div className="full-height-auto" style={{
        minHeight: 0,
        position: 'relative',
        backgroundColor: 'white',
        display: 'flex',
      }}>{children}</div>
      {!store.app.hideMenu && <div style={{ backgroundColor: 'white', paddingBottom: 'env(safe-area-inset-bottom)' }}></div>}
    </div >
  )}</Observer>
}