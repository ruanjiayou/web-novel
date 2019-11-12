import React, { useContext as useReactContext, useState } from 'react'
import MIconView from 'components/MIconView'
// 上下文context.避免react多级一直传props
const Context = React.createContext(null)

function Navi(prop) {
  return (
    <div className="dd-common-alignside" style={{ height: 45, padding: '0 15px', backgroundColor: 'white', borderBottom: '1px solid #eee' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: prop.showBack === false ? 'none' : 'inline-block' }}>
          <MIconView type="FaChevronLeft" onClick={() => { console.log(prop); prop.router.back() }} />
        </div>
      </div>
      <div style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '600' }}>{prop.title}</div>
      <div style={{ flex: 1, textAlign: 'right' }}>{prop.children}</div>
    </div>
  )
}

export function createNaviProvider() {
  return [Navi, Context]
}

export function useNaviContext() {
  return useReactContext(Context)
}