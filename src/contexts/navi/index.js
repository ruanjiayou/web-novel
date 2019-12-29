import React, { useContext as useReactContext } from 'react'
import { MIconView } from 'components'
import { useRouterContext } from '../router'
// 上下文context.避免react多级一直传props
const Context = React.createContext(null)

function Navi(prop) {
  const router = useRouterContext()
  return (
    <div className="dd-common-alignside" style={{ height: 45, padding: '0 15px', backgroundColor: 'white', borderBottom: '1px solid #eee' }}>
      <div style={{ flex: '0 1 0%', display: 'flex', flexDirection: 'row', }} onClick={() => { router.back() }}>
        <div style={{ display: prop.showBack === false ? 'none' : 'flex' }}>
          <MIconView type="FaChevronLeft" />
        </div>
        <div>{prop.left}</div>
      </div>
      <div className="txt-omit" style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '600' }}>{prop.title}</div>
      <div style={{ flex: '0 0 0%', textAlign: 'right' }}>{prop.children}</div>
    </div>
  )
}

export function createNaviProvider() {
  return [Navi, Context]
}

export function useNaviContext() {
  return useReactContext(Context)
}