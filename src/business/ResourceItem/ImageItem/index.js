import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { useRouterContext } from 'contexts'
import { Tag } from 'antd-mobile'
import { FullWidth, FullWidthAuto, FullWidthFix } from 'components/common'
import { TagsRow } from './style'

export default function ({ item }) {
  const router = useRouterContext()
  return <Observer>
    {() => {
      return <Fragment>
        <FullWidth style={{ backgroundColor: '#eee', width: '100%', position: 'relative' }} onClick={() => {
          router.pushView(`Image`, { id: item.id })
        }}>
          <FullWidthFix style={{ width: 60, height: 80, margin: '0 5px 5px', position: 'relative', overflow: 'hidden' }}>
            <img style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', height: '100%' }} src={item.auto_cover} alt="" />
            <div style={{ position: 'absolute', top: 4, right: 4, zIndex: 2, color: 'white', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%', padding: '3px 5px' }}>{item.images.length || 1}</div>
          </FullWidthFix>
          <FullWidthAuto>
            <div>{item.title}</div>
            <div style={{ margin: '5px 0' }}>作者: {item.uname}</div>
            <TagsRow onTouchStart={e => {
              e.stopPropagation()
              e.preventDefault()
            }}>
              {item.tags.map((tag, index) => <Tag key={index}>{tag}</Tag>)}
            </TagsRow>
          </FullWidthAuto>
        </FullWidth>
      </Fragment>
    }}</Observer >
}