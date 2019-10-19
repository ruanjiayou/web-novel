import React from 'react'
import { Observer } from 'mobx-react-lite'
import FilterRow from '../FitlerRow'

export default function Filter({ self }) {
  return <Observer>{() => (
    <div style={{ padding: 5 }}>{self.children.map(child => (<FilterRow self={child} key={child.id} />))}</div>
  )}</Observer>
}