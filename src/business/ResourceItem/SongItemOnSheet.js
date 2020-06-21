import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { MIconView } from 'components'

export default function ({ item, router }) {
  return <Observer>
    {() => (
      <Fragment>
        <div className="dd-common-alignside" style={{ margin: '0 10px', padding: '10px  0 5px 0', borderBottom: '1px solid #eee' }} onClick={() => { router.pushView(`song-sheet`, { id: item.id }) }}>
          {item.title}
          <MIconView type="FaAngleRight" />
        </div>
      </Fragment>
    )}
  </Observer>
}