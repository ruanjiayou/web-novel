import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { useRouterContext } from 'contexts'
import { ImgLine } from 'components'
import timespan from 'utils/timespan'
// import config from 'config'

export default function ({ item }) {
  const router = useRouterContext()
  return <Observer>
    {() => {
      return <Fragment>
        <div className="full-width" style={{ padding: 10 }} onClick={() => { router.pushView('BookInfo', { id: item.id }) }}>
          <div className="full-width-fix" style={{ width: 60, height: 80, backgroundColor: 'green', marginRight: 20 }}>
            <ImgLine style={{ width: '100%', height: '100%' }} src={item.poster ? item.poster : '/poster/nocover.jpg'} alt="" />
          </div>
          <div className="full-width-auto full-height">
            <div className="dd-common-alignside">
              <div style={{ fontSize: '1.2rem' }}>{item.title}</div>
            </div>
            <div style={{ padding: '4px 0', color: 'rgb(146, 145, 145)' }}>{item.uname} · {item.type}</div>
            <div style={{ color: 'rgb(146, 145, 145)' }}>{timespan(new Date(item.last.createdAt || Date.now()))} · {item.last.title || '最新章节'}</div>
          </div>
        </div>
      </Fragment>
    }
    }
  </Observer>

}