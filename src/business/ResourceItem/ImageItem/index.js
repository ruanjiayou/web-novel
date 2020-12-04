import React, { Fragment } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useRouterContext } from 'contexts'
import { Tag, ActivityIndicator } from 'antd-mobile'
import { FullWidth, FullWidthAuto, FullWidthFix } from 'components/common'
import { MIconView } from 'components'
import { TagsRow } from './style'
import services from 'services'

export default function ({ item }) {
  const router = useRouterContext()
  const local = useLocalStore(() => ({
    loading: false,
    id: item.id,
    markStatus: item.marked ? 'like' : 'dislike', // like/error
    markLoading: false,
    markError: false,
  }))
  const MStatus  = function() {
    if(local.markLoading) {
      return <ActivityIndicator animating={true}/>
    } else if(local.markError) {
      return <MIconView type="FaSyncAlt"/>
    } else if(local.markStatus === 'dislike') {
      return <MIconView type="FaHeart" style={{ color: 'white' }} />
    } else {
      return <MIconView type="FaHeart" style={{ color: 'red' }} />
    }
  }
  return <Observer>
    {() => {
      return <Fragment>
        <FullWidth style={{ backgroundColor: '#eee', width: '100%', position: 'relative' }} onClick={() => {
          router.pushView('Image', { id: item.id })
        }}>
          <FullWidthFix style={{ width: 60, height: 80, margin: '0 5px 5px', position: 'relative', overflow: 'hidden' }}>
            <img style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', height: '100%' }} src={item.auto_cover} alt="" />
            <div style={{ position: 'absolute', right: 0, bottom: 0, height: 24, width: 24 }} onClick={async(e)=>{
              e.stopPropagation()
              e.preventDefault()
              if (local.markLoading) return
              local.markLoading = true
              try {
                if(local.markStatus=== 'dislike') {
                  await services.createMark({ data: { id: item.id } })
                  local.markStatus = 'like'
                } else {
                  await services.destroyMark({ params: { id: item.id } })
                  local.markStatus = 'dislike'
                }
              } catch(e) {
                local.markError = true
              } finally {
                local.markLoading = false
              }
            }}>
              {MStatus()}
            </div>
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