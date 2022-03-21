import React from 'react'
import { Observer } from 'mobx-react-lite'
import { isPWAorMobile } from 'utils/utils'
import { useStoreContext } from 'contexts'

export default function UserAreaView({ children, className, style, bar }) {
  const store = useStoreContext();
  return <Observer>{() => (
    <div className="full-height" style={{ overflow: 'hidden' }}>
      {bar && isPWAorMobile() ? (
        <div style={{ position: 'relative', zIndex: 8888, backgroundColor: store.app.barBGC, height: 'env(safe-area-inset-top)', }}></div>
      ) : null
      }
      <div className="full-height-auto" style={{ minHeight: 0, position: 'relative', display: 'flex', }}>{children}</div>
    </div >
  )}</Observer>
}