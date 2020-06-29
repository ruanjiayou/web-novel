import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { useRouterContext } from 'contexts'
import { ImgLine } from 'components'
import { Tag } from 'antd-mobile'

export default function ({ item }) {
  const router = useRouterContext()
  return <Observer>
    {() => {
      return <Fragment>
        <div className="full-width" style={{ backgroundColor: '#eee', width: '100%', position: 'relative' }} onClick={() => {
          router.pushView(`Image`, { id: item.id })
        }}>
          <div className="full-width-fix" style={{ width: 60, height: 80, margin: '0 5px 5px', position: 'relative', overflow: 'hidden' }}>
            <ImgLine style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', height: '100%' }} src={item.poster ? item.poster : '/poster/nocover.jpg'} alt="" />
            <div style={{ position: 'absolute', top: 4, right: 4, zIndex: 2, color: 'white', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%', padding: '3px 5px' }}>{item.images.length || 1}</div>
          </div>
          <div className="full-width-auto" >
            <div>{item.title}</div>
            <div style={{ margin: '5px 0' }}>作者: {item.uname}</div>
            <div onTouchStart={e => {
              e.stopPropagation()
              e.preventDefault()
            }} style={{ overflowX: 'auto', width: 340, whiteSpace: 'nowrap' }}>{item.tags.map((tag, index) => <Tag key={index}>{tag}</Tag>)}</div>
          </div>
        </div>
      </Fragment>
    }
    }
  </Observer>

}