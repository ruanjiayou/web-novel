import React, { useContext as useReactContext } from 'react'
import { MIconView } from 'components'
import { AlignSide, AlignCenterXY } from 'components/common'
import { useRouterContext } from '../router'
import { useStoreContext } from '../store'
// 上下文context.避免react多级一直传props
const Context = React.createContext(null)

function Navi(prop) {
  const router = useRouterContext()
  const store = useStoreContext()
  return (
    <AlignSide style={{ height: 45, backgroundColor: store.app.barBGC, borderBottom: '1px solid #eee', ...prop.wrapStyle }}>
      <AlignCenterXY onClick={() => { router.back() }}>
        <div style={{ display: prop.showBack === false ? 'none' : 'flex' }}>
          <MIconView type="FaChevronLeft" />
        </div>
        <div>{prop.left}</div>
      </AlignCenterXY>
      <div className="txt-omit" style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '600' }}>{prop.title}</div>
      <div style={{ flex: '0 0 30px', textAlign: 'right', whiteSpace: 'nowrap' }}>{prop.children}</div>
    </AlignSide>
  )
}

export function createNaviProvider() {
  return [Navi, Context]
}

export function useNaviContext() {
  return useReactContext(Context)
}