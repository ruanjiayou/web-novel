import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import 'components/common.css'
import config from 'config'
import { useRouterContext } from 'contexts/router'

export default function ({ item }) {
  const router = useRouterContext()
  return <Observer>
    {() => {
      return <Fragment>
        <div className="full-width" style={{ margin: 10 }} onClick={() => { router.pushView(`/root/book/${item.id}/info`, null, { hideMenu: true, id: item.id }) }}>
          <div className="full-width-fix" style={{ width: 60, height: 80, backgroundColor: 'green', marginRight: 20 }}>
            <img style={{ width: '100%', height: '100%' }} src={item.poster ? config.config.development.host + item.poster : config.config.development.host + '/poster/nocover.jpg'} alt="" />
          </div>
          <div className="full-width-auto full-height">
            <div className="dd-common-alignside">
              <div style={{ fontSize: '1.2rem' }}>{item.title}</div>
            </div>
            <div style={{ padding: '4px 0', color: 'rgb(146, 145, 145)' }}>{item.uname} · {item.catalog} · {item.status === 'loading' ? '连载' : '完结'} · {item.words}</div>
            <div style={{ color: 'rgb(146, 145, 145)' }} className="line2">{item.desc}</div>
          </div>
        </div>
      </Fragment>
    }
    }
  </Observer>

}