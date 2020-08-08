import React, { useContext, useRef, useEffect, useCallback, useState } from 'react'
import { useAudio, useEffectOnce } from 'react-use'
import { Popover, Slider } from 'antd-mobile'
import events from 'utils/events'
import store from '../../global-state'
import storage from 'utils/storage'
import { useRouterContext } from 'contexts'
import { SongSheetSongLoader } from 'loader'
import { Observer, useLocalStore, useComputed } from 'mobx-react-lite'
import { MIconView, Dragger, VisualBoxView, SwitchView } from 'components'

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
    onEnded={() => {
      console.log('ended')
      if (music.mode === music.MODE.ONE) {
        controls.play()
      }
      if (music.mode === music.MODE.RANDOM) {
        music.playRandom()
      } else {
        music.playNext()
      }
    }} />);
  const local = useLocalStore((state) => {
    const pos = storage.getValue('music');
    return {
      loader: SongSheetSongLoader.create(),
      top: pos ? pos.top : 210,
      left: pos ? pos.left : 100,
      get time() {
        return state.time || 0
      },
      get duration() {
        return state.duration || 0
      },
      get percent() {
        return 100 * state.time / (state.duration || 1)
      },
      get currentUrl() {
        return music.currentUrl;
      },
      mapping: {
        [music.MODE.ONE]: 'MdRepeatOne',
        [music.MODE.RANDOM]: 'MdShuffle',
        [music.MODE.LIST]: 'MdTrendingFlat',
        [music.MODE.CIRCLE]: 'MdRepeat',
      }
    };
  }, state);
  useEffect(() => {
    // 解决相互引用的问题
    setPlayUrl(music.currentUrl)
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
        <div style={{ position: 'fixed', right: 20, top: state.isPlaying ? local.top : 100, zIndex: 1000 }}>
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
          <div id="musicOperation" style={{ width: '100%', boxSizing: 'border-box', padding: '5px 10px' }} className="full-width">
            <MIconView type="MdShuffle" />
            <MIconView type="MdSkipNext" onClick={() => {
              if (music.mode === music.MODE.RANDOM) {
                music.playRandom()
              } else {
                music.playNext()
              }
              controls.play()
            }} />
            <MIconView type={state.isPlaying ? 'IoIosPause' : 'IoIosPlay'} onClick={() => {
              state.isPlaying ? controls.pause() : controls.play()
            }} />
            <div className="full-width-auto" style={{ display: 'flex', flexDirection: 'row' }}>
              <span className="full-width-fix">{local.time.toFixed(0)}</span>
              <div style={{ flex: 1, marginTop: 8, paddingLeft: 16, paddingRight: 8 }}>
                <Slider disabled={music.isLoading} value={local.percent} min={0} max={100} onAfterChange={v => {
                  console.log(v)
                }} />
              </div>
              <span className="full-width-fix">{local.duration.toFixed(0)}</span>
            </div>
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