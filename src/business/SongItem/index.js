import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import CoverItem from './CoverItem'
import NormalItem from './Normaltem'

export default function SongItem({ item, loader, type, ...props }) {
  return <Observer>
    {() => {
      switch (type) {
        case 'cover':
          return <CoverItem item={item} loader={loader}{...props} />
        default:
          return <NormalItem item={item} loader={loader} {...props} />
      }
    }
    }
  </Observer>

}