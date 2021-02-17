import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import BookItem from './BookItem'
import SongItem from './SongItem'
import ImageItem from './ImageItem/'
import ArticleItem from './ArticleItem'
import VideoItem from './VideoItem'

export default function ResourceItem({ item, loader, type }) {
  if (!type) {
    type = item.source_type
  }
  return <Observer>
    {() => {
      let Item = <ArticleItem item={item} loader={loader} />
      switch (type) {
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
        case 'news':
          Item = <ArticleItem item={item} loader={loader} />
          break
          case 'video':
            Item = <VideoItem item={item} loader={loader} />
            break
        default:
          break
      }
      return Item
    }
    }
  </Observer>

}