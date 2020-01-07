import React from 'react'
import { Observer } from 'mobx-react-lite'

export default function FilterTag({ self, selectTag }) {
  return <Observer>{() => (
    <span className={`comp-tag ${self.attrs.selected ? 'selected' : ''}`} onClick={() => selectTag(self.id)}>{self.title}</span>
  )}</Observer>
}