import React, { useEffect, useRef, useCallback } from 'react'
import { useVideo, useEffectOnce } from 'react-use'
import { useGesture } from 'react-use-gesture'
import { Observer, useLocalStore } from 'mobx-react-lite'
import VisualBox from '../VisualBoxView'
import { Icon } from './style'
import format from 'utils/num2time'
import { FullHeight, FullHeightAuto, FullHeightFix, FullWidth, FullWidthAuto, FullWidthFix, AlignRight, AlignSide, AlignAround, AlignCenterXY } from '../common'
import { Toast } from 'antd-mobile'
const styles = {
  videoBG: {
    width: '100%',
    height: '100%',
  }
}

export default function ({ router, store, resource, srcpath, playNext, }) {
  const videoRef = useRef(null)
  const local = useLocalStore(() => ({
    muted: false,
    paused: false,
    autoplay: true,
    showControl: false,
    showMore: false,
    isWaiting: false,
    isSeeking: false,
    isEnded: false,
    isReady: false,
    isRotated: false,
    fullscreen: false,
    realtime: 0,
    seektime: 0,
    percent: 0,
    seekDirection: 'forword',
    timer: null,
    origin: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    openControl() {
      this.showControl = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.showControl = false
      }, 4000)
    },
    closeControl() {
      this.showControl = false
      clearTimeout(this.timer)
      this.timer = null
    },
    openMore() {
      console.log('open more')
    },
    closeMore() {
      console.log('close control')
    },

  }))
  const getHistoryTime = useCallback(async () => {

  }, [])
  const onLoadedMetadata = useCallback(async () => {
    console.log('load metadata')
  })
  const onDrag = function (e) {
    local.offset.x = e.touches[0].clientX - local.origin.x
    local.offset.y = e.touches[0].clientY - local.origin.y
  }
  useEffectOnce(() => {
    const onRotation = function () {
      local.isRotated = !window.matchMedia('(orientation: portrait)').matches
    }
    window.addEventListener('orientationchange', onRotation)
    return () => {
      window.removeEventListener('orientationchange', onRotation)
    }
  }, [])
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', onLoadedMetadata)
      return () => {
        videoRef.current.removeEventListener('loadedmetadata', onLoadedMetadata)
      }
    }
  }, [onLoadedMetadata, srcpath])
  const [video, state, controls, ref] = useVideo(<video
    style={styles.videoBG}
    autoPlay={local.autoplay}
    type='video'
    poster={local.poster}
    playsInline={true}
    muted={local.muted}
    src={srcpath}
    airplay="allow"
    webkit-airplay='allow'
    x-webkit-airplay='allow'
    onTouchStart={e => {
      local.origin.x = e.touches[0].clientX
      local.origin.y = e.touches[0].clientY
      local.offset.x = 0
      local.offset.y = 0
      if (ref.current) {
        ref.current.removeEventListener('touchmove', onDrag)
        ref.current.addEventListener('touchmove', onDrag)
      }
    }}
    onTouchEnd={() => {
      if (ref.current && local.offset.x && local.offset.y) {
        ref.current.removeEventListener('touchmove', onDrag)
        if (Math.abs(local.offset.x) > Math.abs(local.offset.y)) {
          local.seektime += local.offset.x
          controls.seek(local.seektime)
        }
      }
    }}
    onClick={() => {
      local.openControl()
    }}
    onProgress={() => {
      // despirate
    }}
    onTimeUpdate={() => {
      // state.time
      local.realtime = state.time
      if (!local.isSeeking) {
        local.seektime = state.time
      }
      local.percent = (state.time / (state.duration || 1)).toFixed(2) * 100
    }}
    onWaiting={() => {
      local.isWaiting = true
    }}
    onCanPlay={() => {
      local.isWaiting = false
    }}
    onEnded={() => {
      local.isEnded = true
    }}
    onPause={() => {
      controls.pause()
      local.paused = true
    }}
    onPlaying={() => {
      local.paused = false
    }}
    onSeeking={() => {
      local.isWaiting = true
    }}
    onSeeked={() => {
      local.isWaiting = false
      if (local.isEnded) {
        local.isEnded = false
        controls.play()
      }
    }}
  />)

  const renderVideoLayer = function () {
    return <div style={{ position: 'absolute', width: '100%', height: '100%', }}>
      {video}
      <div style={{ position: 'absolute', width: '100%', height: 2, bottom: 0, backgroundColor: 'grey' }}>
        <div style={{ position: 'absolute', height: '100%', width: local.percent + '%', backgroundColor: 'rgb(22, 147, 255)' }}></div>
      </div>
    </div>
  }
  const renderControlLayer = function () {
    return (
      <VisualBox visible={local.showControl}>
        <FullHeight
          style={{ position: 'absolute', width: '100%', color: 'white', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <AlignRight style={{ paddingTop: 10 }}>
            <Icon src={require('theme/icon/airplay.svg')} />
            <Icon style={{ width: 20, height: 20 }} src={require('theme/icon/feedback.svg')} />
            <Icon style={{ width: 24 }} onClick={() => {
              local.closeControl()
              local.showMore = true
            }} src={require('theme/icon/more.svg')} />
          </AlignRight>
          <FullHeightAuto onClick={() => {
            local.closeControl()
          }}>
            <AlignCenterXY>
              <div onClick={(e) => {
                local.paused = !local.paused
                if (local.paused) {
                  controls.pause()
                } else {
                  controls.play()
                }
                e.preventDefault()
                e.stopPropagation()
              }}><Icon src={local.paused ? require('../../theme/icon/play-fill.svg') : require('../../theme/icon/suspended-fill.svg')} /></div>
            </AlignCenterXY>
          </FullHeightAuto>
          <FullWidth style={{ paddingBottom: 10 }}>
            <FullWidthFix onClick={() => local.muted = !local.muted}>
              <Icon src={local.muted ? require('../../theme/icon/mute.svg') : require('../../theme/icon/soundsize.svg')} />
            </FullWidthFix>
            <VisualBox visible={!!playNext}>
              <FullHeightFix>
                <Icon onClick={playNext} style={{ width: 20, marginLeft: 0 }} src={require('../../theme/icon/next.svg')} />
              </FullHeightFix>
            </VisualBox>
            <FullWidthAuto style={{ backgroundColor: 'grey', borderRadius: 3, overflow: 'hidden' }} onClick={e => {
              console.log(e)
            }}>
              <div style={{ width: local.percent + '%', height: 5, backgroundColor: '#1278ae' }}></div>
            </FullWidthAuto>
            <FullWidthFix style={{ marginLeft: 10 }}>{format(Math.ceil(local.realtime))}</FullWidthFix>
            <FullWidthFix>
              <Icon onClick={() => {
                if (!document.fullscreenEnabled) {
                  return
                }
                if (document.fullscreenElement) {
                  document.exitFullscreen()
                  local.fullscreen = false
                } else if (videoRef.current && videoRef.current.requestFullscreen) {
                  videoRef.current.requestFullscreen()
                  local.fullscreen = true
                } else {
                  Toast.info('全屏失败', 1, null, false)
                }
              }} style={{ width: 24 }} src={require('theme/icon/fullscreen.svg')} />
            </FullWidthFix>
          </FullWidth>
        </FullHeight>
      </VisualBox>
    )
  }
  const renderMoreLayer = function () {
    return <VisualBox visible={local.showMore}>
      <FullHeight style={{ width: '100%', position: 'absolute' }} onClick={() => {
        local.showMore = false
      }}>
        more
    </FullHeight>
    </VisualBox>
  }
  return <Observer>{() => (
    <div style={{ width: '100%', position: 'relative', height: Math.ceil(window.screen.width * 9 / 16) }}>
      <div style={{ position: 'absolute', width: '100%', height: '100%' }} ref={ref => videoRef.current = ref}>
        {renderVideoLayer()}
        {renderControlLayer()}
        {renderMoreLayer()}
      </div>
    </div>
  )}</Observer>
}