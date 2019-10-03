import React from 'react'
import { Observer } from 'mobx-react-lite'

export default ({ self, children }) => {
  return <Observer>
    {() => {
      return <div className="dd-common-centerXY">
        Hello World!{children}
      </div>
    }}
  </Observer>

}