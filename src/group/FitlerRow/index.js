import React from 'react'
import { Observer } from 'mobx-react-lite'
import FilterTag from '../FilterTag'
import { Container } from './style'

export default function FilterRow({ self, onQueryChange }) {
  function selectTag(id) {
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
    <Container>{self.children.map(child => (<FilterTag self={child} key={child.id} selectTag={selectTag} />))}</Container>
  )}</Observer>
}