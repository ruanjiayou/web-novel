import React from 'react'
import { Observer } from 'mobx-react-lite'
import FilterTag from '../FilterTag'
import '../group.css'

export default function FilterRow({ self, onQueryChange }) {
  function selectTag(group_id) {
    if (self.group_id === group_id) {
      self.selected(true)
    } else {
      self.selected(false)
    }
    self.children.forEach(child => {
      if (child.group_id === group_id) {
        child.selected(true)
      } else {
        child.selected(false)
      }
    })
    onQueryChange()
  }
  return <Observer>{() => (
    <div style={{ margin: '5px 10px', whiteSpace: 'nowrap', overflowX: 'hidden', overflowY: 'hidden' }}><span className={`comp-tag ${self.attrs.selected ? 'selected' : ''}`} onClick={() => selectTag(self.group_id)}>{self.name}</span>{self.children.map(child => (<FilterTag self={child} key={child.id} selectTag={selectTag} />))}</div>
  )}</Observer>
}