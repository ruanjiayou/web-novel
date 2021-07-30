import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { useRouterContext } from 'contexts'
import timespan from 'utils/timespan'
import { Button } from 'antd-mobile'
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
              <Button type="primary" size="small" onClick={(e) => {
                e.stopPropagation();
                router.pushView('BookChapter', { bid: item.id, id: item.last_seen_id })
              }}>继续阅读</Button>
            </div>
            <div style={{ padding: '4px 0', color: 'rgb(146, 145, 145)' }}>{item.uname} · {item.type}</div>
            <div onClick={(e) => {
              e.stopPropagation();
              router.pushView('BookChapter', { bid: item.id, id: item.last_seen_id })
            }} style={{ color: 'rgb(146, 145, 145)' }}>已读到 {item.last_seen_title} · {timespan(new Date(item.last_seen_ts))}</div>
          </div>
        </div>
      </Fragment>
    }}
  </Observer>
}