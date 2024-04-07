import React, { Fragment, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player'
import { useStoreContext, useRouterContext, useNaviContext } from 'contexts';
import { useLocalStore, Observer } from 'mobx-react-lite';
import styled from 'styled-components';
import format from 'utils/num2time';
import MyFinger from '../MyFinger/default';
import VisualBoxView from 'components/VisualBoxView'

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
  background: linear-gradient(0deg,#9d9494,#fdfdfd00);
  padding: 5px 0;
`

export const ProgressWrap = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff3;
  height: 3px;
  border-radius: 5px;
  flex: 1;
  position: relative;
  margin: 0 10px;
`
export const Handler = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 20px;
  position: absolute;
  transform: translate(-8px,-3px);
  background-color: #1196db;
  z-index: 11;
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
}) {
  // TODO: 项目启动拉取用户配置，muted,takePeek,drag,showPanel,进度恢复
  // DONE: 初始化进度，更新进度，快进，buffering，ios全屏：playinline，
  const store = useStoreContext();
  const router = useRouterContext();
  const Navi = useNaviContext()
  const local = useLocalStore(() => ({
    volume: 100,
    muted: false,
    controls: false,
    playing: false,
    player: null,
    playsinline: true,
    fullscreen: false,
    status: VIDEO_STATUS.CANPLAY,
    duration: 0,
    realtime: 0,
    buffertime: 0,
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
    <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: 'black' }}>
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
            tracks: subtitles.map((s, i) => ({ kind: 'subtitles', src: store.app.baseURL + s.path, srcLang: s.lang, default: i === 0 })),
            attributes: {
              poster: resource.auto_cover
            }
          }
        }}
        onReady={(e) => {
          // console.log(e, 'onready')
          local.duration = e.getDuration();
        }}
        onStart={(e) => {
          // console.log(e, 'onstart')
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
              let height = 0;
              if (height) {
                const delta =
                  (evt.distance * (evt.direction === 'Down' ? -1 : 1)) / height;
                local.volume = parseFloat(
                  local.volume + delta > 1
                    ? 1
                    : local.volume + delta < 0
                      ? 0
                      : local.volume + delta,
                );
                // setVolume(local.volume.toFixed(2));
              }
            } else if (evt.direction === 'Left' || evt.direction === 'Right') {
              const offset = evt.distance / 10;
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
            {/* 播放中,已暂停,缓冲中 */}
            {local.showControl && local.status === VIDEO_STATUS.CANPLAY && <Icon
              src={require('theme/icon/play-fill.svg')}
              onTouchEndCapture={(e) => {
                e.preventDefault()
                e.stopPropagation();
                local.playing = true;
                local.showControl = false;
              }}
              onClick={e => {
                e.preventDefault()
                e.stopPropagation();
                local.playing = true;
                local.showControl = false;
              }}
            />}
            {local.showControl && local.status === VIDEO_STATUS.PLAYING && <Icon
              onTouchEndCapture={(e) => {
                e.preventDefault();
                e.stopPropagation();
                local.playing = false;
                local.status = VIDEO_STATUS.CANPLAY;
              }}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                local.playing = false;
                local.status = VIDEO_STATUS.CANPLAY;
              }}
              src={require('../../theme/icon/suspended-fill.svg')}
            />}
            {local.status === VIDEO_STATUS.BUFFERING && <Icon className='spin-slow' src={require('../../theme/icon/loading.svg')}
            />}
          </div>
        </MyFinger>
      </VisualBoxView>
      {local.showControl && (
        <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 45, zIndex: 12, background: 'linear-gradient(0deg, rgb(217 215 215 / 0%), rgb(83 81 81 / 67%))' }}>
          <Navi
            showBack
            wrapStyle={{
              flex: 1,
              backgroundColor: 'transparent',
              borderBottom: 'none',
              width: '100%',
            }}></Navi>
        </div>
      )}
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
        borderRadius: 5,
        zIndex: 12,
        bottom: '20%',
        width: '100%',
        textAlign: 'center',
      }}>{local.error}</div>}
      {local.showControl && <BottomWrap ref={ref => botRef.current = ref}>
        <ProgressWrap className='progress' onClickCapture={e => {
          e.stopPropagation();
          e.preventDefault();
          const parentRect = e.currentTarget.getBoundingClientRect();
          const offsetX = e.clientX - parentRect.left;
          const time = local.duration * (offsetX / e.currentTarget.offsetWidth)
          local.realtime = time;
          local.player.seekTo(time, 'seconds')
        }}>
          <div style={{ position: 'absolute', left: 0, width: (local.duration ? 100 * local.buffertime / local.duration : 0) + '%', zIndex: 9, height: '100%', backgroundColor: '#eee' }}></div>
          <div style={{ position: 'absolute', left: 0, width: local.isDrag ? local.displayPercent : (local.duration ? 100 * local.realtime / local.duration : 0) + '%', zIndex: 10, height: '100%', backgroundColor: '#1196db' }}></div>

          <Handler
            style={{ left: local.isDrag ? local.displayPercent : (local.duration ? 100 * local.realtime / local.duration : 0) + '%' }}
            onTouchStart={e => {
              e.preventDefault();
              e.stopPropagation();
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
              local.displayPercent = 100 * offsetX / parentRect.width + '%';
            }}
            onTouchEnd={e => {
              e.preventDefault();
              e.stopPropagation();
              const time = parseFloat(local.displayPercent) * local.duration / 100
              local.player.seekTo(time)
              local.realtime = time;
              local.isDrag = false;
              local.displayPercent = 0;
            }}
          />
        </ProgressWrap>
        <span>{format(local.realtime)}/{format(local.duration)}</span>
        <img src={local.playsinline ? require('theme/icon/fullscreen.svg') : require('theme/icon/quit-fullscreen.svg')} alt="" style={{ width: 20, height: 20, margin: '0 5px' }} onClick={() => {
          local.fullscreen = !local.fullscreen;
          local.playsinline = !local.fullscreen
        }} />
      </BottomWrap>}
    </div>
  )}
  </Observer>
}