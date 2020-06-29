import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'

export default function ({ item, router, nth }) {
  return <Observer>
    {() => {
      return <Fragment>
        <div style={{ margin: '0 10px', padding: '10px  0 5px 0', borderBottom: '1px solid #eee' }} onClick={() => { router.pushView('BookChapter', { bid: item.bid, id: item.id }) }}>
          <div style={{ fontSize: '1.2rem' }}>第{nth}章 {item.title}</div>
          <div style={{ color: 'grey', padding: '5px 0' }}>{item.createdAt}</div>
        </div>
      </Fragment>
    }
    }
  </Observer>

}