import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { useRouterContext } from 'contexts'
import timespan from 'utils/timespan'
// import config from 'config'

export default function ({ item }) {
  const router = useRouterContext()
  return <Observer>
    {() => {
      return <Fragment>
        <div className="full-width" style={{ padding: 10 }} onClick={() => { router.pushView('BookInfo', { id: item.id }) }}>
          <div className="full-width-fix" style={{ width: 60, height: 80, backgroundColor: '#0094fd', marginRight: 20 }}>
            <img style={{ width: '100%', height: '100%' }} src={item.auto_cover} alt="" />
          </div>
          <div className="full-width-auto full-height">
            <div className="dd-common-alignside">
              <div style={{ fontSize: '1.2rem' }}>{item.title}</div>
            </div>
            <div style={{ padding: '4px 0', color: 'rgb(146, 145, 145)' }}>{item.uname} · {item.types && item.types[0] || '无'}</div>
            {item.last ? <div style={{ color: 'rgb(146, 145, 145)' }}>{timespan(new Date(item.last.createdAt || Date.now()))} · {item.last.title || '最新章节'}</div> : null}
          </div>
        </div>
      </Fragment>
    }
    }
  </Observer>

}