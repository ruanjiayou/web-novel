import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import { useVideo, useEffectOnce, } from 'react-use'
import { useGesture } from 'react-use-gesture'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Icon, FlvWrap } from './style'
import format from 'utils/num2time'
import { useNaviContext } from 'contexts'
import { MIconView, VisualBoxView, SwitchView } from 'components'
import { FullHeight, FullHeightAuto, FullHeightFix, FullWidth, FullWidthAuto, FullWidthFix, AlignRight, AlignSide, AlignAround, AlignCenterXY } from '../common'
import { Toast } from 'antd-mobile'
import ReactHlsPlayer from 'react-hls-player';
import { ReactFlvPlayer } from 'react-flv-player'

const styles = {
  videoBG: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  }
}

export default function ({ router, type, store, resource, onRecord, srcpath, looktime, playNext, }) {
  const Navi = useNaviContext()
  const fullScreenRef = useRef(null)
  const local = useLocalStore(() => ({
    muted: false,
    paused: true,
    autoplay: false,
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
    duration: 0,
    percent: 0,
    volume: 1,
    seekDirection: 'forword',
    timer: null,
    origin: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    openControl() {
      this.showControl = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.showControl = false
      }, 8000)
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
  const onLoadedMetadata = (duration) => {
    local.duration = duration
    controls.seek(looktime)
  }
  const onTimeUpdate = (time) => {
    if (onRecord) {
      onRecord(time)
    }
    local.realtime = time
    if (!local.isSeeking) {
      local.seektime = time
    }
    local.percent = (time / (local.duration || 1)).toFixed(4) * 100
  }
  const onDrag = function (e) {
    local.offset.x = e.touches[0].clientX - local.origin.x
    local.offset.y = e.touches[0].clientY - local.origin.y
  }

  const onKeyPress = function (e) {
    switch (e.keyCode) {
      case 37:
        // <=
        if (type === 'mpeg' && ref.current) {
          ref.current.currentTime -= 5;
        } else if (type === 'hls' && hlsRef.current) {
          hlsRef.current.currentTime -= 5
        } else if (type === 'flv' && flvRef.current) {
          flvRef.current.currentTime -= 5
        }
        break;
      case 39:
        // =>
        if (type === 'mpeg' && ref.current) {
          ref.current.currentTime += 5;
        } else if (type === 'hls' && hlsRef.current) {
          hlsRef.current.currentTime += 5
        } else if (type === 'flv' && flvRef.current) {
          flvRef.current.currentTime += 5
        }
        break;
      case 38:
        // ^
        local.volume = state.volume + 0.05 > 1 ? 1 : state.volume + 0.05
        controls.volume(state.volume)
        break;
      case 40:
        local.volume = state.volume - 0.05 < 0 ? 0 : state.volume - 0.05
        controls.volume(local.volume)
        break;
      default: break;
    }
  }
  useEffect(() => {
    local.closeControl()
  }, [srcpath]);
  useEffectOnce(() => {
    const onRotation = function () {
      local.isRotated = window.matchMedia('(orientation: portrait)').matches
    }
    window.addEventListener('orientationchange', onRotation)
    window.addEventListener('keydown', onKeyPress)
    return () => {
      window.removeEventListener('orientationchange', onRotation)
      window.removeEventListener('keydown', onKeyPress)
    }
  }, [])
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
    onLoadedMetadata={() => {
      local.volume = state.volume
      onLoadedMetadata(state.duration)
    }}
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
    onTimeUpdate={(e) => {
      onTimeUpdate(state.time, state.duration)
    }}
    onWaiting={() => {
      local.isWaiting = true
    }}
    onCanPlay={() => {
      local.paused = !state.isPlaying
      local.isWaiting = false
    }}
    onEnded={() => {
      local.isEnded = true
      playNext();
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
  const hlsRef = useRef(null)
  const hlsVideo = useMemo(() => {
    return <ReactHlsPlayer
      src={srcpath}
      autoPlay={false}
      playerRef={hlsRef}
      onLoadedMetadata={e => {
        if (hlsRef.current) {
          onLoadedMetadata(hlsRef.current.duration)
        }
      }}
      onTimeUpdate={(e) => {
        onTimeUpdate(hlsRef.current.currentTime)
      }}
      onSeeking={() => {
        local.isWaiting = true
      }}
      onSeeked={() => {
        local.isWaiting = false
      }}
      controls={false}
      width="100%"
      height="100%"
    />
  }, [srcpath])
  const flvRef = useRef(null)
  const flvVideo = useMemo(() => {
    return <FlvWrap>
      <ReactFlvPlayer
        ref={ref => {
          if (ref) {
            flvRef.current = ref.myRef.current
            if (!local.autoplay) {
              flvRef.current.pause()
            }
            flvRef.current.muted = local.muted
            flvRef.current.controls = false
          }
        }}
        url={srcpath}
        isMuted={local.muted}
        handleError={e => {
          console.log(e, 'flv play error')
        }}
      />
    </FlvWrap>
  }, [srcpath])
  const renderVideoLayer = function () {
    return <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'black' }}>
      {type === 'hls' ? hlsVideo : (type === 'flv' ? flvVideo : video)}
      <div style={{ position: 'absolute', width: '100%', height: 2, bottom: 0, backgroundColor: 'grey' }}>
        <div style={{ position: 'absolute', height: '100%', width: local.percent + '%', backgroundColor: 'rgb(22, 147, 255)' }}></div>
      </div>
    </div>
  }
  const renderControlLayer = function (header) {
    return (
      <VisualBoxView visible={local.showControl}>
        <FullHeight
          style={{ position: 'absolute', width: '100%', color: 'white', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          {/* 顶部菜单 */}
          <AlignSide style={{ position: 'absolute', left: 0, top: 0, width: '100%', zIndex: 2, }}>
            {header(<div>
              <Icon src={require('theme/icon/airplay.svg')} />
              <Icon style={{ width: 16 }} src={require('theme/icon/feedback.svg')} />
              <Icon style={{ width: 18 }} onClick={() => {
                local.closeControl()
                local.showMore = true
              }} src={require('theme/icon/more.svg')} />
            </div>)}
          </AlignSide>
          <FullHeightAuto onClick={() => {
            local.closeControl()
          }}>
            <SwitchView loading={local.isWaiting} holder={
              <div style={{ position: 'absolute', top: 0, display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}><MIconView type="IoLoader" style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '4px 0' }} /></div>
            }>
              <AlignCenterXY>
                <div style={{ position: 'absolute', top: 0, display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}><Icon onClick={(e) => {
                  if (type === 'mpeg') {
                    local.paused ? controls.play() : controls.pause()
                  } else if (type === 'hls' && hlsRef.current) {
                    local.paused ? hlsRef.current.play() : hlsRef.current.pause()
                  } else if (type === 'flv' && flvRef.current) {
                    local.paused ? flvRef.current.play() : flvRef.current.pause()
                  }
                  e.preventDefault()
                  e.stopPropagation()
                  local.paused = !local.paused
                }} src={local.paused ? require('../../theme/icon/play-fill.svg') : require('../../theme/icon/suspended-fill.svg')} /></div>
              </AlignCenterXY>
            </SwitchView>
          </FullHeightAuto>
          {/* 底部菜单 */}
          <FullWidth style={{ paddingBottom: 10, zIndex: 2 }}>
            <FullWidthFix onClick={() => {
              local.muted = !local.muted
              if (flvRef.current) {
                flvRef.current.muted = local.muted
              }
            }}>
              <Icon style={{ width: 24, height: 24 }} src={local.muted ? require('../../theme/icon/mute.svg') : require('../../theme/icon/soundsize.svg')} />
            </FullWidthFix>
            <VisualBoxView visible={resource.children.length < 2}>
              <FullHeightFix>
                <Icon onClick={playNext} style={{ width: 16, height: 15, marginLeft: 0 }} src={require('../../theme/icon/next.svg')} />
              </FullHeightFix>
            </VisualBoxView>
            <FullWidthFix style={{ marginRight: 10 }}>{format(Math.ceil(local.realtime))}</FullWidthFix>
            <FullWidthAuto style={{ backgroundColor: 'grey', borderRadius: 3, overflow: 'hidden' }} onClick={e => {
              const ne = e.nativeEvent;
              let time = local.duration * (ne.layerX / e.currentTarget.offsetWidth)
              if (type === 'mpeg') {
                if (controls) {
                  controls.seek(time)
                }
              } else if (type === 'hls' && hlsRef.current) {
                hlsRef.current.currentTime = time;
              } else if (type === 'hlv' && flvRef.current) {
                flvRef.current.currentTime = time;
              }
            }}>
              <div style={{ width: local.percent + '%', height: 5, backgroundColor: '#1278ae' }}></div>
            </FullWidthAuto>
            <FullWidthFix style={{ marginLeft: 10 }}>{format(Math.ceil(local.duration))}</FullWidthFix>
            <FullWidthFix>
              <Icon onClick={() => {
                if (local.isRotated) {
                  local.isRotated = false;
                  if (!local.fullscreen) {
                    return
                  }
                }
                if (!document.fullscreenEnabled) {
                  return
                }
                if (document.fullscreenElement) {
                  document.exitFullscreen()
                  local.fullscreen = false
                } else if (fullScreenRef.current && fullScreenRef.current.requestFullscreen) {
                  fullScreenRef.current.requestFullscreen()
                  local.fullscreen = true
                } else {
                  Toast.info('全屏失败', 1, null, false)
                }
              }} style={{ width: 20 }} src={require('theme/icon/fullscreen.svg')} />
            </FullWidthFix>
          </FullWidth>
        </FullHeight>
      </VisualBoxView>
    )
  }
  const renderMoreLayer = function () {
    return <VisualBoxView visible={local.showMore}>
      <FullHeight style={{ width: '100%', position: 'absolute' }} onClick={() => {
        local.showMore = false
      }}>
        more
    </FullHeight>
    </VisualBoxView>
  }
  return <Observer>{() => (
    <div style={{ width: '100%', position: local.isRotated ? 'absolute' : 'relative', height: local.isRotated ? '100%' : 211, zIndex: 2 }} ref={ref => fullScreenRef.current = ref}>
      {renderVideoLayer()}
      {renderControlLayer(child => <Navi title={resource.title} showBack wrapStyle={{ flex: 1, backgroundColor: 'transparent', borderBottom: 'none', width: '100%', height: 35 }}>{child}</Navi>)}
      {renderMoreLayer()}
      {!local.showControl ? <div
        onClick={() => local.openControl()}
        style={{ position: 'absolute', display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <SwitchView loading={local.isWaiting} holder={<MIconView type="IoLoader" style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '4px 0' }} />}>
          {(local.paused ? <Icon onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (type === 'mpeg') {
              controls.play();
              local.paused = false
            } else if (type === 'hls' && hlsRef.current) {
              hlsRef.current.play();
              local.paused = false
            } else if (type === 'flv' && flvRef.current) {
              flvRef.current.play()
              local.paused = false;
            }
          }} src={require('../../theme/icon/play-fill.svg')} /> : null)}
        </SwitchView>
      </div> : null}
    </div>
  )}</Observer>
}