import React from 'react'
import { Observer } from 'mobx-react-lite'
import FilterRow from '../FitlerRow'

export default function Filter({ self, ...props }) {
  return <Observer>{() => (
    <div style={{ padding: 5 }}>{self.children.map(child => (<FilterRow self={child} key={child.id} onQueryChange={() => {
      let query = {}
      self.children.forEach(child => {
        child.children.forEach(tag => {
          if (tag.attrs.selected) {
            Object.assign(query, tag.params)
          }
        })
      })
      if (props.onQueryChange) {
        props.onQueryChange(query)
      }
    }} />))}</div>
  )}</Observer>
}