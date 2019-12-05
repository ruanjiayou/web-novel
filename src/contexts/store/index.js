import React, { useContext as useReactContext, useState } from 'react'
// 上下文context.避免react多级一直传props
const Context = React.createContext(null)

export function useProvider(store) {
  let [state] = useState(store)
  return [state, Context]
}

export function useStoreContext() {
  return useReactContext(Context)
}