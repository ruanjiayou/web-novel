import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { useRouterContext } from 'contexts'

export default function ({ item }) {
  const router = useRouterContext()
  return <Observer>
    {() => {
      return <Fragment>
        <div className="full-width" style={{ margin: 10 }} onClick={() => { router.pushView(`VideoInfo`, { id: item.id }) }}>
          <div className="full-width-fix" style={{ width: 60, height: 80, flexShrink: 0, backgroundColor: 'green', marginRight: 20 }}>
            <img style={{ width: '100%', height: '100%' }} src={item.auto_cover} alt="" />
          </div>
          <div className="full-width-auto full-height">
            <div className="dd-common-alignside">
              <div style={{ fontSize: '1.2rem', wordBreak: 'break-all' }}>{item.title}</div>
            </div>
            <div style={{ padding: '4px 0', color: 'rgb(146, 145, 145)' }}>{item.status === 'loading' ? '连载' : '完结'} · {item.chapters}集</div>
            <div style={{ color: 'rgb(146, 145, 145)', wordBreak: 'break-all' }} className="line2" dangerouslySetInnerHTML={{ __html: item.desc }}></div>
          </div>
        </div>
      </Fragment>
    }
    }
  </Observer>

}