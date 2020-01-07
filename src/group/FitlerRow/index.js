import React from 'react'
import { Observer } from 'mobx-react-lite'
import FilterTag from '../FilterTag'

export default function FilterRow({ self, onQueryChange }) {
  function selectTag(id) {
    if (self.id === id) {
      self.selected(true)
    } else {
      self.selected(false)
    }
    self.children.forEach(child => {
      if (child.id === id) {
        child.selected(true)
      } else {
        child.selected(false)
      }
    })
    onQueryChange()
  }
  return <Observer>{() => (
    <div style={{ margin: '5px 10px', whiteSpace: 'nowrap', overflowX: 'auto', overflowY: 'hidden' }}>{self.children.map(child => (<FilterTag self={child} key={child.id} selectTag={selectTag} />))}</div>
  )}</Observer>
}