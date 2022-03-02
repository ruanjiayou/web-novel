import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react'
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
import { isPWAorMobile } from '../../utils/utils'
import MyFinger from '../MyFinger/default'
import ResourceItem from 'business/ResourceItem';

const styles = {
  videoBG: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  }
}
// status: ready,waiting,playing,paused,error,ended,
// 
const VIDEO_LIVE_STATUS = {
  POSTER: 1,
  LOADING: 2,
  PLAYING: 3,
  PAUSED: 4,
  ENDED: 5,
  ERRORED: 6,
  SEEKING: 7,
}
export default function ({ router, type, store, resource, onRecord, srcpath, looktime, playNext, next }) {
  const Navi = useNaviContext()
  const fullScreenRef = useRef(null)
  const local = useLocalStore(() => ({
    muted: false,
    paused: true,
    autoplay: true,
    showControl: true,
    showMore: false,
    isWaiting: false,
    isSeeking: false,
    isEnded: false,
    isReady: false,
    isMobile: isPWAorMobile(),
    isVertical: window.matchMedia('(orientation: portrait)').matches,
    isError: false,
    fullscreen: false,
    realtime: 0,
    seektime: 0,
    duration: 0,
    percent: 0,
    volume: 1,
    showVolume: false,
    volumeTimer: null,
    seekDirection: 'forword',
    timer: null,
    dblTimer: null,
    dblCount: 0,
    origin: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    takePeek() {
      this.showVolume = true;
      clearTimeout(this.volumeTimer);
      this.volumeTimer = setTimeout(() => {
        this.showVolume = false;
      }, 1000)
    },
    openControl() {
      this.showControl = true
      clearTimeout(this.timer)
      if (!this.paused) {
        this.timer = setTimeout(() => {
          this.showControl = false
        }, 5000)
      }
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

  }), [])
  const getHistoryTime = useCallback(async () => {

  }, []);
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

  const setVolume = function (v) {
    if (hlsRef.current) {
      hlsRef.current.volume = v;
    }
    if (ref.current) {
      controls.volume(v);
    }
    if (flvRef.current) {
      flvRef.current.volume = v;
    }
    local.takePeek();
  }
  // 声音和进度控制
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
        if (hlsRef.current) {
          local.volume = (hlsRef.current.volume + 0.1 > 1 ? 1 : hlsRef.current.volume + 0.1).toFixed(2)
        }
        if (ref.current) {
          local.volume = (ref.current.volume + 0.1 > 1 ? 1 : ref.current.volume + 0.1).toFixed(2)
        }
        if (flvRef.current) {
          local.volume = (flvRef.current.volume + 0.1 > 1 ? 1 : flvRef.current.volume + 0.1).toFixed(2)
        }
        setVolume(local.volume)
        break;
      case 40:
        if (hlsRef.current) {
          local.volume = (hlsRef.current.volume - 0.1 < 0 ? 0 : hlsRef.current.volume - 0.1).toFixed(2)
          hlsRef.current.volume = local.volume
        }
        if (ref.current) {
          local.volume = (ref.current.volume - 0.1 < 0 ? 0 : ref.current.volume - 0.1).toFixed(2)
          controls.volume(local.volume)
        }
        if (flvRef.current) {
          local.volume = (flvRef.current.volume - 0.1 < 0 ? 1 : flvRef.current.volume - 0.1).toFixed(2)
          flvRef.current.volume = local.volume
        }
        local.takePeek()
        break;
      default: break;
    }
  }

  /**
   * 定位视频位置
   * @param {number} time 
   */
  const onSeek = function (time) {
    time = Math.round(time);
    if (type === 'mpeg') {
      if (controls) {
        controls.seek(time)
      }
    } else if (type === 'hls' && hlsRef.current) {
      hlsRef.current.currentTime = time;
    } else if (type === 'hlv' && flvRef.current) {
      flvRef.current.currentTime = time;
    }
  }
  // 播放或暂停
  const onAction = function () {
    local.isEnded = false;
    local.isError = false;
    if (type === 'mpeg') {
      local.paused ? controls.play() : controls.pause()
    } else if (type === 'hls' && hlsRef.current) {
      local.paused ? hlsRef.current.play() : hlsRef.current.pause()
    } else if (type === 'flv' && flvRef.current) {
      local.paused ? flvRef.current.play() : flvRef.current.pause()
    }
    local.paused = !local.paused
  }
  useEffect(() => {
    local.isError = false;
    local.closeControl()
  }, [srcpath]);
  useEffectOnce(() => {
    const onRotation = function () {
      // 竖屏模式
      local.isVertical = !local.isVertical
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
    playsInline
    poster={resource.auto_cover}
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
      local.showControl = false
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
    onError={e => {
      local.isError = true;
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
      playsInline
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
      onErrorCapture={e => {
        console.log(e)
      }}
      onError={(e) => {
        local.isError = true
        console.log(e)
      }}
      hlsConfig={{
        onError(e) {
          console.log(e)
        }
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
      {!local.showControl && <div style={{ position: 'absolute', width: '100%', height: 2, zIndex: 2, bottom: 0, backgroundColor: 'grey' }}>
        <div style={{ position: 'absolute', height: '100%', width: local.percent + '%', backgroundColor: 'rgb(22, 147, 255)' }}></div>
      </div>}
    </div>
  }
  const renderControlLayer = function (header) {
    return (
      <FullHeight
        style={{ position: 'absolute', width: '100%', color: 'white', }}>
        {/* 顶部菜单 */}
        <AlignSide style={{ position: 'absolute', left: 0, top: 0, width: '100%', zIndex: 2, background: local.showControl ? 'linear-gradient(-180deg, #333, transparent)' : '' }}>
          {header(local.showControl && !local.fullscreen ? <div>
            <Icon src={require('theme/icon/airplay.svg')} />
            <Icon style={{ width: 16 }} src={require('theme/icon/feedback.svg')} />
            <Icon style={{ width: 18 }} onClick={() => {
              local.closeControl()
              local.showMore = true
            }} src={require('theme/icon/more.svg')} />
          </div> : null)}
        </AlignSide>
        {local.showVolume && <div style={{ position: 'absolute', left: '50%', top: '20%', transform: 'translate(-50%,-50%)', padding: '10px', borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.6)', color: 'white' }}>{Math.round(local.volume * 100)}%</div>}
        <MyFinger
          onTap={() => {
            local.dblCount++;
            if (local.dblTimer) {
              clearTimeout(local.dblTimer);
              local.dblTimer = null;
            }
            local.dblTimer = setTimeout(function () {
              if (local.dblCount === 1) {
                local.showControl ? local.closeControl() : local.openControl();
              }
              local.dblCount = 0;
            }, 300)
          }}
          onDoubleTap={() => {
            onAction();
          }}
          onSwipe={(evt) => {
            if (evt.direction === 'Up' || evt.direction === 'Down') {
              let height = 0;
              if (hlsRef.current) {
                height = hlsRef.current.offsetHeight
              }
              if (ref.current) {
                height = ref.current.offsetHeight
              }
              if (flvRef.current) {
                height = flvRef.current.offsetHeight
              }
              if (height) {
                const delta = (evt.distance * (evt.direction === 'Down' ? -1 : 1) / height);
                local.volume = parseFloat(local.volume + delta > 1 ? 1 : (local.volume + delta < 0 ? 0 : local.volume + delta));
                setVolume(local.volume.toFixed(2));
              }

            } else if (evt.direction === 'Left' || evt.direction === 'Right') {
              const offset = evt.distance / 5;
              const time = Math.max(0, Math.round(local.realtime + offset * (evt.direction === 'Left' ? -1 : 1)));
              onSeek(time);
            }
          }}>
          <FullHeightAuto
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {local.isError && <span style={{ color: 'white' }}>播放错误</span>}
          </FullHeightAuto>
        </MyFinger>
        <VisualBoxView visible={local.showControl}>
          {/* 底部菜单 */}
          <FullWidth style={{ paddingTop: 10, paddingBottom: 5, zIndex: 2, background: 'linear-gradient(0deg, #333, transparent)' }}>
            {/* 静音 */}
            {/* <FullWidthFix onClick={() => {
              local.muted = !local.muted
              if (flvRef.current) {
                flvRef.current.muted = local.muted
              }
            }}>
              <Icon style={{ width: 24, height: 24 }} src={local.muted ? require('../../theme/icon/mute.svg') : require('../../theme/icon/soundsize.svg')} />
            </FullWidthFix> */}
            {/* 播放/暂停 */}
            <VisualBoxView visible={local.showControl}>
              <Icon onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onAction()
              }} src={local.paused ? require('../../theme/icon/play-fill.svg') : require('../../theme/icon/suspended-fill.svg')} />
            </VisualBoxView>
            {/* 下一集 */}
            <VisualBoxView visible={resource.children.length > 1}>
              <FullHeightFix>
                <Icon onClick={playNext} style={{ width: 16, height: 15, marginLeft: 0 }} src={require('../../theme/icon/next.svg')} />
              </FullHeightFix>
            </VisualBoxView>
            {/* 进度条 */}
            <FullWidthAuto style={{ backgroundColor: 'grey', margin: '0 5px', borderRadius: 3, overflow: 'hidden' }} onClick={e => {
              const ne = e.nativeEvent;
              let time = local.duration * (ne.layerX / e.currentTarget.offsetWidth)
              onSeek(time);
            }}>
              <div style={{ width: local.percent + '%', height: 5, backgroundColor: '#1278ae' }}></div>
            </FullWidthAuto>
            {/* 时间信息 */}
            <FullWidthFix>{format(Math.ceil(local.realtime))}</FullWidthFix>/
            <FullWidthFix>{format(Math.ceil(local.duration))}</FullWidthFix>
            {/* 全屏按钮 */}
            <FullWidthFix>
              <Icon onClick={() => {
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
              }} style={{ width: 20, height: 20 }} src={require('theme/icon/fullscreen.svg')} />
            </FullWidthFix>
          </FullWidth>
        </VisualBoxView>
      </FullHeight>
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
  const renderEndedLayer = function () {
    return <VisualBoxView visible={local.isEnded}>
      <FullHeight style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.8)', position: 'absolute', width: '100%' }}>
        <FullHeightAuto />
        <AlignCenterXY style={{ flex: 2, height: 'auto', width: '100%' }}>
          {next && <ResourceItem item={next} onClick={() => { router.replaceView('VideoInfo', { id: next.id }) }} />}
        </AlignCenterXY>
        <FullHeightFix>
          <MIconView type="FaRedo" after="重播" style={{ padding: 10 }} onClick={() => {
            onAction()
          }} />
        </FullHeightFix>
      </FullHeight>
    </VisualBoxView>
  }
  return <Observer>{() => (
    <div style={{ width: '100%', position: !local.isVertical ? 'absolute' : 'relative', height: !local.isVertical ? '100%' : 211, zIndex: 2 }} ref={ref => fullScreenRef.current = ref}>
      {renderVideoLayer()}
      {renderControlLayer(child => <Navi title={!local.isVertical && local.showControl ? resource.title : null} showBack wrapStyle={{ flex: 1, backgroundColor: 'transparent', borderBottom: 'none', width: '100%', height: 35 }}>{child}</Navi>)}
      {renderMoreLayer()}
      {renderEndedLayer()}
    </div>
  )}</Observer>
}