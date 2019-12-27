import React from 'react'
import { isPWAorMobile } from 'utils/utils'

export default function UserAreaView({ children, className, style, bar }) {
  return (
    <div className="full-height">
      {bar && isPWAorMobile() ? (
        <div style={{ position: 'relative', zIndex: 8888 }}>
          <div style={{ height: 'env(safe-area-inset-top)' }}>
            <div style={{ position: 'fixed', right: 0, left: 0, top: 0, backgroud: '#000', height: 'env(safe-area-inset-top)', paddingTop: 'env(safe-area-inset-top)' }}></div>
          </div>
        </div>
      ) : null
      }
      <div className="full-height-auto" style={{ minHeight: 0, position: 'relative', display: 'flex' }}>{children}</div>
    </div >
  )
}