import React, { Fragment, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player'
import { MIconView } from 'components';
import { useStoreContext, useRouterContext, useNaviContext } from 'contexts';
import { useLocalStore, Observer } from 'mobx-react-lite';
import styled from 'styled-components';
import format from 'utils/num2time';
import MyFinger from '../MyFinger/default';
import VisualBoxView from 'components/VisualBoxView'
import storage from 'utils/storage.js';

export const Icon = styled.img`
  width: 32px;
  height: 32px;
  margin: 0 5px;
`;
export const BottomWrap = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flexDirection: column;
  z-index: 4;
  align-items: center;
  color: white;
  background: linear-gradient(0deg,#00000080,#fdfdfd00);
  padding: 5px;
  box-sizing: border-box;
`

export const ProgressWrap = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px;
  border-radius: 5px;
  flex: 1;
  position: relative;
  margin: 0 10px 2px 10px;
`
export const Handler = styled.div`
  width: 16px;
  height: 10px;
  border-radius: 20px;
  position: absolute;
  transform: translate(-8px,-4px);
  background-color: #2bb7ff;
  z-index: 11;
`
export const Tip = styled.span`
  position: absolute;
  left: 50%;
  transform: translate(-50%, -30px);
  background-color: #00000080;
  border-radius: 5px;
  padding: 3px 5px;
  &::after {
    position: absolute;
    left: 50%;
    bottom: -6px;
    transform: translateX(-50%);
    content: '';
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 6px solid  #00000080;
  }
`
const VIDEO_STATUS = {
  CANPLAY: 'CANPLAY',
  PLAYING: 'PLAYING',
  BUFFERING: 'BUFFERING',
}

export default function Player({
  resource,
  srcpath,
  subtitles,
  looktime,
  onTimeUpdate,
  type,
}) {
  // TODO: 项目启动拉取用户配置，muted,takePeek,drag,showPanel,进度恢复
  // DONE: 初始化进度，更新进度，快进，buffering，ios全屏：playinline，
  const store = useStoreContext();
  const router = useRouterContext();
  const Navi = useNaviContext()
  const containRef = useRef(null)
  const local = useLocalStore(() => ({
    volume: window.volume || parseInt(storage.getValue('volume')) || 30,
    muted: storage.getValue('muted') ? true : false,
    controls: false,
    playsinline: true,
    fullscreen: window.orientation === 0 ? false : true,
    autoplay: false,

    playing: false,
    player: null,
    status: VIDEO_STATUS.CANPLAY,
    duration: 0,
    realtime: 0,
    buffertime: 0,
    dragtime: 0,
    displayPercent: 0,
    showControl: true,
    isDrag: false,
    error: '',
    // 恢复进度显示
    showRecover: false,
    bottomHeight: 0,
    // 手势显示：进度和声音改变
    showPeek: false,
    peekValue: '',
    takePeek(value) {
      this.peekValue = value;
      this.showPeek = true;
      clearTimeout(this.peekTimer);
      this.peekTimer = setTimeout(() => {
        this.showPeek = false;
      }, 1000);
    },
  }));
  const botRef = useRef(null)
  useEffect(() => {
    if (botRef.current) {
      local.bottomHeight = botRef.current.offsetHeight;
    }
    return () => {
      // console.log('before unmount', resource.id)
    }
  }, [resource.id])
  return <Observer>{() => (
    <div ref={ref => containRef.current = ref} style={local.fullscreen ? {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      zIndex: 9,
      display: 'flex',
      justifyContent: 'center',
      boxSizing: 'border-box',
      overflow: 'hidden',
    } : {
      position: 'relative',
      width: '100%',
      backgroundColor: 'black',
      zIndex: 9,
    }}>
      <div style={{
        position: 'relative',
        width: local.fullscreen ? 'calc(100% - env(safe-area-inset-left) - env(safe-area-inset-right))' : '100%',
        height: local.fullscreen ? 'calc(100% - env(safe-area-inset-bottom))' : 'auto',
        boxSizing: 'border-box',
        paddingTop: local.fullscreen ? 0 : '56.25%',
        marginLeft: 'env(safe-area-inset-left)',
        marginRight: 'env(safe-area-inset-right)',
      }}>
        <ReactPlayer
          style={{ position: 'absolute', left: 0, top: 0, zIndex: 2 }}
          url={srcpath}
          ref={ref => local.player = ref}
          loop={false}
          playing={local.playing}
          width={'100%'}
          height={'100%'}
          pip={false}
          controls={local.controls}
          playsinline={local.playsinline}
          wrapper={'div'}
          config={{
            file: {
              forceHLS: type === 'hls',
              tracks: subtitles.map((s, i) => ({ kind: 'subtitles', src: store.app.baseURL + s.path, srcLang: s.lang, default: i === 0 })),
              attributes: {
                poster: resource.auto_cover,
              }
            }
          }}
          onDuration={(duration) => {
            local.duration = duration
          }}
          onReady={(e) => {
            // console.log(e, 'onready')
            // local.duration = e.getDuration() || 0;
          }}
          onStart={(e) => {
            console.log(e, 'onstart')
            if (looktime) {
              local.showRecover = true;
              setTimeout(() => {
                local.showRecover = false;
              }, 4000)
            }
          }}
          onEnded={(e) => {
            // console.log(e, 'onended')
            local.status = VIDEO_STATUS.CANPLAY
          }}
          onError={(e) => {
            console.log(e.message, typeof e.message, 'onerror')
            local.error = e.message;
          }}
          onPlay={(e) => {
            console.log(e, 'onplay')
            local.playing = true;
            local.status = VIDEO_STATUS.PLAYING
            local.error = ''
          }}
          onPause={(e) => {
            console.log(e, 'onpause')
            local.playing = false
            local.status = VIDEO_STATUS.CANPLAY
          }}
          onBuffer={(e) => {
            local.status = VIDEO_STATUS.BUFFERING;
          }}
          onBufferEnd={(e) => {
            // console.log(e, 'onbufferend')
            if (local.playing) {
              local.status = VIDEO_STATUS.PLAYING
            } else {
              local.status = VIDEO_STATUS.CANPLAY
            }
          }}
          onProgress={(e) => {
            local.buffertime = e.loadedSeconds
            local.realtime = e.playedSeconds
            onTimeUpdate && onTimeUpdate(local.realtime)
          }}
          onSeek={(time) => {
            // console.log(time, 'onseeek', local.duration)
          }}
        />
        {local.showControl && (
          <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 45, lineHeight: '45px', zIndex: 12, background: 'linear-gradient(180deg,#00000080,#fdfdfd00)' }}>
            <MIconView inline color='white' type="FaChevronLeft" onClick={() => {
              if (local.fullscreen) {
                local.fullscreen = false
              } else {
                router.back()
              }
            }} />
          </div>
        )}
        <VisualBoxView visible={!local.controls}>
          <MyFinger
            onTap={() => {
              const temp = local.playing;
              setTimeout(() => {
                if (local.playing === false && temp === true) {

                } else {
                  console.log('tap?')
                  local.showControl = !local.showControl
                }

              }, 100)
            }}
            onDoubleTap={() => {
              console.log('double')
              local.playing = !local.playing
              local.status = local.playing ? VIDEO_STATUS.PLAYING : VIDEO_STATUS.CANPLAY
            }}
            onSwipe={(evt) => {
              if (evt.direction === 'Up' || evt.direction === 'Down') {
                let height = containRef.current ? containRef.current.offsetHeight : 0;
                if (height) {
                  const delta =
                    (1.2 * evt.distance * (evt.direction === 'Down' ? -1 : 1)) / height;
                  local.volume = parseFloat(
                    local.volume + delta > 1
                      ? 1
                      : local.volume + delta < 0
                        ? 0
                        : local.volume + delta,
                  );
                  if (window.setVolume) {
                    window.setVolume(parseFloat(local.volume.toFixed(2)));
                  }
                }
              } else if (evt.direction === 'Left' || evt.direction === 'Right') {
                const offset = (evt.distance / 10).toFixed(0);
                const time = Math.max(
                  0,
                  Math.round(
                    local.realtime + offset * (evt.direction === 'Left' ? -1 : 1),
                  ),
                );
                local.player.seekTo(time)
                local.takePeek(offset + 's')
              }
            }}
          >
            <div style={{
              zIndex: 3,
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              touchAction: 'manipulation',
            }}
            >
              {local.status === VIDEO_STATUS.BUFFERING && <Icon className='spin-slow' src={require('../../theme/icon/loading.svg')}
              />}
            </div>
          </MyFinger>
        </VisualBoxView>
        {local.showPeek && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '20%',
              transform: 'translate(-50%,-50%)',
              padding: 7,
              borderRadius: 5,
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: 'white',
              zIndex: 12,
            }}
          >
            {local.peekValue}
          </div>
        )}
        {local.showRecover && <div style={{
          position: 'absolute',
          backgroundColor: '#0004',
          color: 'white',
          padding: '4px 5px',
          borderRadius: 5,
          zIndex: 12,
          left: 15,
          bottom: 10 + (local.showControl ? local.bottomHeight : 0)
        }} onClick={() => {
          local.player.seekTo(looktime);
          local.showRecover = false;
          local.showControl = false
        }}>恢复到 {format(looktime)}</div>}
        {local.error && <div style={{
          position: 'absolute',
          backgroundColor: '#0004',
          color: 'red',
          padding: '4px 5px',
          //boxSizing: 'border-box',
          borderRadius: 5,
          zIndex: 12,
          bottom: '20%',
          width: '100%',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>{local.error}</div>}
        {local.showControl && <BottomWrap ref={ref => botRef.current = ref}>
          {/* 播放中,已暂停,缓冲中 */}
          {local.playing ? <Icon
            style={{ width: 24, height: 24, margin: 0 }}
            onTouchEndCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (local.status === VIDEO_STATUS.BUFFERING) {
                return;
              }
              local.playing = false;
              local.status = VIDEO_STATUS.CANPLAY;
            }}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              if (local.status === VIDEO_STATUS.BUFFERING) {
                return;
              }
              local.playing = false;
              local.status = VIDEO_STATUS.CANPLAY;
            }}
            src={require('../../theme/icon/suspended-fill.svg')}
          /> : <Icon
            style={{ width: 24, height: 24, margin: 0 }}
            src={require('theme/icon/play-fill.svg')}
            onTouchEndCapture={(e) => {
              e.preventDefault()
              e.stopPropagation();
              if (local.status === VIDEO_STATUS.BUFFERING) {
                return;
              }
              local.playing = true;
            }}
            onClick={e => {
              e.preventDefault()
              e.stopPropagation();
              if (local.status === VIDEO_STATUS.BUFFERING) {
                return;
              }
              local.playing = true;
            }}
          />}
          <ProgressWrap className='progress' onClickCapture={e => {
            e.stopPropagation();
            e.preventDefault();
            const parentRect = e.currentTarget.getBoundingClientRect();
            const offsetX = e.clientX - parentRect.left;
            const time = local.duration * (offsetX / e.currentTarget.offsetWidth)
            local.realtime = time;
            local.player.seekTo(time, 'seconds')
          }}>
            <div style={{ position: 'absolute', left: 0, top: 3, width: '100%', height: 4, backgroundColor: '#fff4' }}></div>
            <div style={{ position: 'absolute', left: 0, top: 3, width: (local.duration ? 100 * local.buffertime / local.duration : 0) + '%', zIndex: 9, height: 4, backgroundColor: '#eee' }}></div>
            <div style={{ position: 'absolute', left: 0, top: 3, width: local.isDrag ? local.displayPercent : (local.duration ? 100 * local.realtime / local.duration : 0) + '%', zIndex: 10, height: 4, backgroundColor: '#1196db' }}></div>

            <Handler
              style={{ left: local.isDrag ? local.displayPercent : (local.duration ? 100 * local.realtime / local.duration : 0) + '%' }}
              onTouchStart={e => {
                e.preventDefault();
                e.stopPropagation();
                local.dragtime = local.realtime;
                local.displayPercent = 100 * local.realtime / local.duration + '%';
                local.isDrag = true;
              }}
              onTouchMove={e => {
                const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
                let offsetX = e.touches[0].clientX - parentRect.left;
                if (offsetX < 0) {
                  offsetX = 0;
                }
                if (offsetX > parentRect.width) {
                  offsetX = parentRect.width;
                }
                local.dragtime = Math.round(offsetX / parentRect.width * local.duration)
                local.displayPercent = 100 * offsetX / parentRect.width + '%';
              }}
              onTouchEnd={e => {
                e.preventDefault();
                e.stopPropagation();
                const time = local.dragtime
                local.player.seekTo(time)
                local.realtime = time;
                local.isDrag = false;
                local.displayPercent = 0;
                local.dragtime = 0;
              }}
            >
              {local.isDrag && <Tip>{format(local.dragtime)}</Tip>}
            </Handler>
          </ProgressWrap>
          <span>{format(local.realtime)}/{format(local.duration)}</span>
          <img src={local.fullscreen ? require('theme/icon/quit-fullscreen.svg') : require('theme/icon/fullscreen.svg')} alt="" style={{ width: 20, height: 20, margin: '0 5px' }} onClick={() => {
            local.fullscreen = !local.fullscreen;
            // if (!containRef.current) {
            //   return;
            // }
            // if (containRef.current.requestFullscreen) {
            //   return containRef.current.requestFullscreen();
            // } else if (containRef.current.webkitRequestFullscreen) {
            //   return containRef.current.webkitRequestFullscreen();
            // } else if (containRef.current.mozRequestFullScreen) {
            //   return containRef.current.mozRequestFullScreen();
            // }
          }} />
        </BottomWrap>}
      </div>
    </div>
  )}
  </Observer>
}