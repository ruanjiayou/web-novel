import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { useRouterContext } from 'contexts'
import timeFormat from 'utils/num2time'
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function ({ item, display = 1, ...props }) {
  const router = useRouterContext()
  const onClick = props.onClick ? () => props.onClick(item) : () => { router.pushView('VideoInfo', { id: item.id }) }
  return <Observer>
    {() => {
      return <Fragment>
        <div className={display === 3 ? 'full-height' : 'full-width'} style={{ margin: 10, overflow: 'hidden', fontSize: '1rem' }} onClick={onClick}>
          <div style={{ width: '10rem', height: '6.5rem', flexShrink: 0, backgroundColor: '#0094fd', backgroundSize: 'cover', marginRight: 20 }}>
            {/* <img style={{ width: '100%', height: '100%', }} src={item.auto_cover} alt="" /> */}
            <LazyLoadImage
              alt={''}
              height={'100%'}
              src={item.auto_cover}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <div className="full-width-auto full-height">
            <div className="dd-common-alignside">
              <div className="line2" style={{ fontSize: '1rem', wordBreak: 'break-all', minHeight: '2.2rem' }}>{item.title}</div>
            </div>
            <div style={{ padding: '4px 0', color: 'rgb(146, 145, 145)' }}>{display !== 3 && <Fragment>{item.status === 'loading' ? '连载' : '完结'} · </Fragment>}{timeFormat(item.words || 0)}</div>
            {display !== 3 && <div style={{ color: 'rgb(146, 145, 145)', wordBreak: 'break-all' }} className="line2" dangerouslySetInnerHTML={{ __html: item.desc }}></div>}
          </div>
        </div>
      </Fragment>
    }
    }
  </Observer>

}