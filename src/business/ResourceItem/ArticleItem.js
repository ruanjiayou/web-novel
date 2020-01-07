import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { useStoreContext, useRouterContext } from 'contexts'
// import config from 'config'

export default function ({ item }) {
  const router = useRouterContext()
  const store = useStoreContext()
  let imageHost = store.lineLoader.getHostByType('image')
  return <Observer>
    {() => {
      return <Fragment>
        <div className="full-width" style={{ padding: 10 }} onClick={() => { router.pushView(`/root/article/${item.id}/info`, null, { hideMenu: true, id: item.id }) }}>
          <div className="full-width-fix" style={{ width: 60, height: 80, backgroundColor: 'green', marginRight: 20 }}>
            <img style={{ width: '100%', height: '100%' }} src={imageHost + (item.poster ? item.poster : '/poster/nocover.jpg')} alt="" />
          </div>
          <div className="full-width-auto full-height">
            <div className="dd-common-alignside">
              <div style={{ fontSize: '1.2rem' }}>{item.title}</div>
            </div>
            <div style={{ padding: '4px 0', color: 'rgb(146, 145, 145)' }}></div>
            <div style={{ color: 'rgb(146, 145, 145)' }}>{item.createdAt}</div>
          </div>
        </div>
      </Fragment>
    }
    }
  </Observer>
}