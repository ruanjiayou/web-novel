import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import 'components/common.css'
import store from '../../global-state'

export default function ({ item, router }) {
  let imageHost = store.lineLoader.getHostByType('image')
  return <Observer>
    {() => {
      return <Fragment>
        <div className="full-width-fix" style={{ height: 320, backgroundColor: '#eee', }}>
          <img src={imageHost + (item.poster ? item.poster : '/poster/nocover.jpg')} style={{ height: '100%' }} />
        </div>
      </Fragment>
    }
    }
  </Observer>

}