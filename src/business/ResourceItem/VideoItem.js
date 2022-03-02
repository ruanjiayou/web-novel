import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { useRouterContext } from 'contexts'
import timeFormat from 'utils/num2time'

export default function ({ item, ...props }) {
  const router = useRouterContext()
  const onClick = props.onClick ? () => props.onClick(item) : () => { router.pushView('VideoInfo', { id: item.id }) }
  return <Observer>
    {() => {
      return <Fragment>
        <div className="full-width" style={{ margin: 10 }} onClick={onClick}>
          <div className="full-width-fix" style={{ width: '10rem', height: '6.5rem', flexShrink: 0, backgroundColor: '#0094fd', marginRight: 20 }}>
            <img style={{ width: '100%', height: '100%' }} src={item.auto_cover} alt="" />
          </div>
          <div className="full-width-auto full-height">
            <div className="dd-common-alignside">
              <div className="line2" style={{ fontSize: '1.2rem', wordBreak: 'break-all' }}>{item.title}</div>
            </div>
            <div style={{ padding: '4px 0', color: 'rgb(146, 145, 145)' }}>{item.status === 'loading' ? '连载' : '完结'} · {timeFormat(item.duration)}</div>
            <div style={{ color: 'rgb(146, 145, 145)', wordBreak: 'break-all' }} className="line2" dangerouslySetInnerHTML={{ __html: item.desc }}></div>
          </div>
        </div>
      </Fragment>
    }
    }
  </Observer>

}