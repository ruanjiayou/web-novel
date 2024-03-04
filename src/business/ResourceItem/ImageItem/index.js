import React, { Fragment } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useRouterContext, useStoreContext } from 'contexts'
import { Tag, ActivityIndicator } from 'antd-mobile'
import { FullWidth, FullWidthAuto, FullWidthFix } from 'components/common'
import { MIconView } from 'components'
import { TagsRow } from './style'
import services from 'services'
import showTip from 'utils/showTip'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import NoImage from 'theme/icon/image-v.svg'

export default function ({ item, display = 1 }) {
  const router = useRouterContext()
  const store = useStoreContext()
  const local = useLocalStore(() => ({
    loading: false,
    id: item.id,
    markStatus: item.marked ? 'like' : 'dislike', // like/error
    markLoading: false,
    markError: false,
  }))
  const MStatus = function () {
    if (local.markLoading) {
      return <ActivityIndicator animating={true} />
    } else if (local.markError) {
      return <MIconView type="FaSyncAlt" />
    } else if (local.markStatus === 'dislike') {
      return <MIconView type="FaHeart" style={{ color: 'white' }} />
    } else {
      return <MIconView type="FaHeart" style={{ color: 'red' }} />
    }
  }
  return <Observer>
    {() => {
      return <Fragment>
        <div className={display === 3 ? 'full-height-auto' : 'full-width'} style={{ position: 'relative', flex: 1, width: '100%' }} onClick={() => {
          router.pushView('Image', { id: item.id })
        }}>
          <div className={display === 3 ? 'full-height' : 'full-width-fix'} style={display === 3 ? { backgroundImage: `url(${NoImage})`, backgroundPosition: 'center center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width: 100, height: 150, position: 'relative', overflow: 'hidden', flexShrink: 0 } : { width: 60, height: 80, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
            {/* <img style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', height: '100%', minWidth: '100%' }} src={item.auto_cover} alt="" /> */}
            <LazyLoadImage
              alt={''}
              height={'100%'}
              src={item.auto_cover}
              style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', height: '100%', minWidth: '100%' }}
            />
            <div style={{ position: 'absolute', right: 0, bottom: 0, height: 24, width: 24 }} onClick={async (e) => {
              e.stopPropagation()
              e.preventDefault()
              if (!store.app.isLogin) {
                return showTip(router)
              }
              if (local.markLoading) return
              local.markLoading = true
              try {
                if (local.markStatus === 'dislike') {
                  await services.createMark({ data: { id: item.id } })
                  local.markStatus = 'like'
                } else {
                  await services.destroyMark({ params: { id: item.id } })
                  local.markStatus = 'dislike'
                }
              } catch (e) {
                local.markError = true
              } finally {
                local.markLoading = false
              }
            }}>
              {MStatus()}
            </div>
            <div style={{ position: 'absolute', top: 4, right: 4, zIndex: 2, color: 'white', minWidth: 25, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50px', padding: '5px 0' }}>{item.images ? item.images.length + 1 : 1}</div>
          </div>
          <div style={display === 3 ? { width: '100%', overflow: 'hidden' } : { flex: 1 }}>
            <div className="line2" style={{ minHeight: '2.4rem', padding: '0 5px' }}>{item.title}</div>
            {display !== 3 && <div style={{ margin: '5px 0' }} className='txt-omit'>by {item.uname}</div>}
            {/* <TagsRow onTouchStart={e => {
              // e.stopPropagation()
              // e.preventDefault()
            }}>
              {item.tags.map((tag, index) => <Tag key={index}>{tag}</Tag>)}
            </TagsRow> */}
          </div>
        </div>
      </Fragment>
    }}</Observer >
}