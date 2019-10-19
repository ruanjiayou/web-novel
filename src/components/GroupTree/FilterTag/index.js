import React from 'react'
import { Observer } from 'mobx-react-lite'
import '../group.css'

export default function FilterTag({ self, selectTag }) {
  return <Observer>{() => (
    <span className={`comp-tag ${self.attrs.selected ? 'selected' : ''}`} onClick={() => selectTag(self.group_id)}>{self.name}</span>
  )}</Observer>
}