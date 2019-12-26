import React, { useEffect } from 'react'
import { Observer } from 'mobx-react-lite'
import FilterRow from '../FitlerRow'
import { useRouterContext } from 'contexts'
import { LoaderListView } from 'components'
import BookListLoader from 'loader/BookListLoader'
import BookItem from 'business/ResourceItem/BookItem'

export default function Filter({ self, ...props }) {
  const router = useRouterContext()
  const booksLoader = BookListLoader.create()
  useEffect(() => {
    if (booksLoader.isEmpty) {
      booksLoader.refresh()
    }
  })
  return <Observer>{() => (
    <div className="full-height">
      <div style={{ padding: 5 }}>{self.children.map(child => (<FilterRow self={child} key={child.id} onQueryChange={() => {
        let query = {}
        self.children.forEach(child => {
          child.children.forEach(tag => {
            if (tag.attrs.selected) {
              Object.assign(query, tag.params)
            }
          })
        })
        booksLoader.refresh({ query })
      }} />))}</div>
      <div className="full-height-auto">
        <LoaderListView
          loader={booksLoader}
          renderItem={(item, selectionId, index) => <BookItem
            item={item}
            router={router}
            selectionId={selectionId}
          />}
        />
      </div>
    </div>
  )}</Observer>
}