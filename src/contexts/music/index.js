import React, { useContext, useRef, useEffect, useCallback, useState } from 'react'
import { useAudio, useEffectOnce } from 'react-use'
import { Popover, Slider } from 'antd-mobile'
import events from 'utils/events'
import store from '../../store'
import storage from 'utils/storage'
import { useRouterContext } from 'contexts'
import { ResourceLoader } from 'loader'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { MIconView, Dragger } from 'components'
import { FullWidth, FullWidthAuto, FullWidthFix, AlignCenterXY, AlignSide } from 'components/common'
import num2time from 'utils/num2time'

// 上下文context.避免react多级一直传props
const Context = React.createContext(null)

function MusicPlayer(props) {
  const router = useRouterContext()
  const music = store.music
  const [playUrl, setPlayUrl] = useState('')
  const [audio, state, controls] = useAudio(<audio id="music-player"
    autoPlay={true}
    src={playUrl}
    controls="controls"
    preload="true"
    onCanPlay={() => {
      console.log('canplay')
    }}
    onLoadedMetadata={() => {
      console.log('loadedmetadata')
    }
    }
    onLoadedData={() => {
      console.log('loadeddata')
      local.isLoading = false
    }}
    onProgress={() => {
      console.log('onProgress')
    }}
    onError={(e) => {
      // play error
    }}
    onEnded={() => {
      console.log('ended')
      if (music.mode === music.MODE.ONE) {
        controls.play()
        return;
      }
      if (music.mode === music.MODE.RANDOM) {
        music.playRandom()
      } else {
        music.playNext()
      }
      setPlayUrl(music.id)
    }} />);
  const local = useLocalStore((state) => {
    const pos = storage.getValue('music');
    return {
      loader: ResourceLoader.create(),
      top: pos ? pos.top : 210,
      left: pos ? pos.left : 100,
      get time() {
        return num2time(state.time || 0)
      },
      get duration() {
        return num2time(state.duration || 0)
      },
      get percent() {
        return 100 * state.time / (state.duration || 1)
      },
      get currentUrl() {
        return music.currentUrl;
      },
      get state() {
        if (music.state === 'paused') {
          controls.pause();
        }
        if (music.state === 'playing') {
          controls.play();
        }
        return music.state;
      },
      mapping: {
        [music.MODE.ONE]: 'MdRepeatOne',
        [music.MODE.RANDOM]: 'MdShuffle',
        [music.MODE.LIST]: 'MdTrendingFlat',
        [music.MODE.CIRCLE]: 'MdRepeat',
      }
    };
  }, state);
  useEffectOnce(() => {
    window.audioPlayer = controls
  })
  useEffect(() => {
    // 解决相互引用的问题
    setPlayUrl(music.currentUrl)
    console.log(music.currentUrl, 'url')
  }, [music.currentUrl])

  let timer = null
  return <Observer>
    {() => (
      <div id="musicBox" style={{
        position: 'absolute',
        top: -100,
        right: 50,
        zIndex: 101,
      }} className="full-width">
        {/* 全局播放器 */}
        {audio}
        {/* 歌单列表显示controls 其他在loading或play状态显示cover */}
        <div style={{ position: 'fixed', right: 20, top: state.isPlaying ? local.top : 100, zIndex: 1000 }} onClick={() => {
          router.pushView('MusicPlayer', { id: music.currentId })
        }}>
          <Dragger cb={sstore => {
            local.left = Math.max(0, sstore.left + sstore.offsetLeft)
            local.top = Math.max(0, sstore.top + sstore.offsetTop)
            clearTimeout(timer)
            timer = null
            timer = setTimeout(() => {
              storage.setValue('music', { left: local.left, top: local.top })
            }, 100)
          }}>
            <div className="spin" style={{ borderRadius: '50%', border: '2px solid white', background: 'pink', width: 40, height: 40 }}>
              <MIconView style={{ height: 40, lineHeight: '40px', color: '#c557c5' }} type="IoMdMusicalNote" />
            </div>
          </Dragger>
        </div>

        <div id="musicOpBox" style={{ position: 'fixed', right: 20, top: -100 }}>
          <div id="musicOperation" style={{ width: '100%', boxSizing: 'border-box', padding: '5px 10px' }} >
            <div style={{ display: 'flex', justifyContent: 'space-between', height: 25, flexDirection: 'column', fontSize: 12, color: 'grey' }}>
              <div style={{ position: 'relative', width: '100%', height: 2, bottom: 0, backgroundColor: 'grey' }} onClick={e => {
                const ne = e.nativeEvent;
                if (controls) {
                  let time = state.duration * (ne.layerX / e.currentTarget.offsetWidth)
                  controls.seek(time)
                }
              }}>
                <div style={{ position: 'absolute', height: '100%', width: local.percent + '%', backgroundColor: 'rgb(22, 147, 255)' }}>
                  <span style={{ width: 6, height: 6, top: -2, borderRadius: '50%', display: 'block', position: 'absolute', right: 0, backgroundColor: '#0094fd' }}></span>
                </div>
              </div>
              <AlignSide>
                <FullWidthFix>{local.time}</FullWidthFix>
                <FullWidthFix>{local.duration}</FullWidthFix>
              </AlignSide>
            </div>
            <AlignCenterXY>
              <MIconView type={local.mapping[music.mode]} onClick={() => {
                switch (music.mode) {
                  case music.MODE.ONE: music.setMode(music.MODE.LIST); break;
                  case music.MODE.LIST: music.setMode(music.MODE.CIRCLE); break;
                  case music.MODE.CIRCLE: music.setMode(music.MODE.RANDOM); break;
                  case music.MODE.RANDOM: music.setMode(music.MODE.ONE); break;
                  default: break;
                }
              }} />
              <MIconView type="MdSkipNext" onClick={() => {
                if (music.mode === music.MODE.RANDOM) {
                  music.playRandom()
                } else {
                  music.playNext()
                }
                router.replaceView('MusicPlayer', { id: music.currentId })
              }} />
              <MIconView type={state.isPlaying ? 'IoIosPause' : 'IoIosPlay'} onClick={() => {
                state.isPlaying ? controls.pause() : controls.play()
              }} />
              <MIconView type={'IoIosVolumeLow'} />
            </AlignCenterXY>
          </div>
        </div>
      </div>
    )
    }
  </Observer >
}

export function createMusicPlayerProvider() {
  return [MusicPlayer, Context]
}

export function useMusicPlayerContext() {
  return useContext(Context)
}