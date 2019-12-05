import React, { useContext as useReactContext } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import store from '../../global-state'
import MIconView from 'components/MIconView'
import Dragger from 'components/Dragger'
// 上下文context.避免react多级一直传props
const Context = React.createContext(null)

function Debug(prop) {
  const debug = store.debug
  const debugStore = useLocalStore(() => ({
    top: 300,
    left: 0,
  }))
  return <Observer>{() => (
    <div className="full-height" style={{
      position: 'fixed',
      color: 'white',
      zIndex: 10,
      width: 300,
      height: 150,
      top: debugStore.top,
      left: debugStore.left,
      padding: 10,
      backgroundColor: 'black',
      opacity: 0.5
    }}>
      <div className="dd-common-alignside">
        <Dragger cb={sstore => {
          debugStore.left = Math.max(0, sstore.left + sstore.offsetLeft)
          debugStore.top = Math.max(0, sstore.top + sstore.offsetTop)
        }}>
          <MIconView type="FaArrowsAlt" />
        </Dragger>
        <div className="dd-common-alignside">
          <MIconView type="FaRegTrashAlt" onClick={() => { debug.clear() }} />
          <MIconView type="FaSyncAlt" onClick={() => { window.location.reload() }} />
        </div>
      </div>
      <div className="full-height-auto">
        {debug.maps.map((item, index) => (<p key={index}>{item.key}:{item.value}</p>))}
      </div>
      <div className="full-height-auto">
        {debug.messages.map((message, index) => <p key={index}>{message}</p>)}
      </div>
    </div>
  )}</Observer>
}

export function createDebugProvider() {
  return [Debug, Context]
}

export function useDebugContext() {
  return useReactContext(Context)
}