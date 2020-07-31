import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import BookItem from './BookItem'
import SongItem from './SongItem'
import ImageItem from './ImageItem/'
import ArticleItem from './ArticleItem'

export default function ({ item, loader }) {
  return <Observer>
    {() => {
      let Item = <div></div>
      switch (item.source_type) {
        case 'novel':
          Item = <BookItem item={item} loader={loader} />
          break
        case 'image':
          Item = <ImageItem item={item} loader={loader} />
          break
        case 'music':
          Item = <SongItem item={item} loader={loader} />
          break
        case 'article': 
          Item = <ArticleItem item={item} loader={loader} />
          break
        default:
          break
      }
      return Item
    }
    }
  </Observer>

}