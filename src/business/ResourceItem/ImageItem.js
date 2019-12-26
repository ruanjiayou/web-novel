import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { useStoreContext } from 'contexts'

export default function ({ item, router }) {
  const store = useStoreContext()
  let imageHost = store.lineLoader.getHostByType('image')
  return <Observer>
    {() => {
      return <Fragment>
        <div className="full-width-fix" style={{ height: 320, backgroundColor: '#eee', }}>
          <img src={imageHost + (item.poster ? item.poster : '/poster/nocover.jpg')} style={{ height: '100%' }} alt=""/>
        </div>
      </Fragment>
    }
    }
  </Observer>

}