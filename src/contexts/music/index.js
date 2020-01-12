import React, { useContext, useRef } from 'react'
import { Popover, Slider } from 'antd-mobile'
import events from 'utils/events'
import store from '../../global-state'
import storage from 'utils/storage'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { MIconView, Dragger, VisualBoxView, SwitchView } from 'components'
import { useStoreContext, useRouterContext } from '../index'

// 上下文context.避免react多级一直传props
const Context = React.createContext(null)

function MusicPlayer() {
  const router = useRouterContext()
  const player = useRef(null)
  const music = store.music
  const MODE = music.type
  const EVENT = music.event
  const pos = storage.getValue('music')
  const musicStore = useLocalStore(() => ({
    url: '',
    showModePop: false,
    isLoading: false,
    status: 'pause',
    percent: 0,
    top: pos ? pos.top : 210,
    left: pos ? pos.left : 100,
  }))
  let timer = null
  events.on(EVENT.PLAY, (id) => {
    if (id === '') {
      if (musicStore.status === 'pause') {
        player.current.play()
      }
      return
    }
    musicStore.url = store.app.baseURL + music.getUrlById(id)
    musicStore.isLoading = true
    musicStore.status = 'play'
    setTimeout(() => {
      // TODO: 请求中间态处理 不停重试,除非遇到错误
      if (player.current) {
        player.current.play()
      }
    }, 100)
  })
  events.on(EVENT.PAUSE, () => {
    musicStore.status = 'pause'
    player.current.pause()
  })
  return <Observer>
    {() => (
      <div style={{
        position: 'fixed',
        top: -100,
        right: 20,
        zIndex: 10,
      }} className="full-width">
        {/* 全局播放器 */}
        <audio id="music-player" ref={value => { player.current = value }}
          onCanPlay={() => {
          }}
          onLoadedMetadata={() => {
          }
          }
          onLoadedData={() => {
            musicStore.isLoading = false
          }}
          onProgress={() => {
            musicStore.percent = 100 * player.current.currentTime / (player.current.duration || 1)
          }}
          onEnded={() => {
            if (music.mode === MODE.ONE) {
              player.current.play()
            }
            if (music.mode === MODE.RANDOM) {
              music.playRandom()
            }
            if (music.mode === MODE.LIST) {
              music.playNext()
            }
            if (music.mode === MODE.CIRCLE) {
              music.playNext()
            }
          }}
          src={musicStore.url} controls="controls" preload="true" />
        {/* 歌单列表显示controls 其他在loading或play状态显示cover */}
        <SwitchView holder={(
          <div style={{ position: 'fixed', right: 20, top: musicStore.isLoading || musicStore.status === 'play' ? musicStore.top : -100, zIndex: 10 }}>
            <Dragger cb={sstore => {
              musicStore.left = Math.max(0, sstore.left + sstore.offsetLeft)
              musicStore.top = Math.max(0, sstore.top + sstore.offsetTop)
              clearTimeout(timer)
              timer = null
              timer = setTimeout(() => {
                storage.setValue('music', { left: musicStore.left, top: musicStore.top })
              }, 100)
            }}>
              <div className="spin" style={{ borderRadius: '50%', border: '2px solid white', background: 'pink', width: 40, height: 40 }}>
                <MIconView style={{ height: 40, lineHeight: '40px', color: '#c557c5' }} type="IoMdMusicalNote" />
              </div>
            </Dragger>
          </div>
        )} loading={!router.getStateKey('music-controls')} >
          <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 10, boxSizing: 'border-box', padding: '5px 10px' }} className="full-width">
            <Popover mask
              placement={'topLeft'}
              visible={musicStore.showModePop}
              overlay={[
                (<Popover.Item key={MODE.ONE} value={MODE.ONE}><MIconView type="MdRepeatOne" />单曲</Popover.Item>),
                (<Popover.Item key={MODE.RANDOM} value={MODE.RANDOM}><MIconView type="MdShuffle" />随机</Popover.Item>),
                (<Popover.Item key={MODE.LIST} value={MODE.LIST}><MIconView type="MdTrendingFlat" />列表</Popover.Item>),
                (<Popover.Item key={MODE.CIRCLE} value={MODE.CIRCLE}><MIconView type="MdRepeat" />循环</Popover.Item>),
              ]}
              onVisibleChange={visible => {
                musicStore.showModePop = visible
              }}
              onSelect={opt => {
                music.setMode(opt.props.value)
                musicStore.showModePop = false
              }}
            >
              <span>
                <SwitchView loading={musicStore.isLoading} holder={<MIconView type="IoIosSync" />}>
                  <VisualBoxView visible={music.mode === MODE.RANDOM}>
                    <MIconView type="MdShuffle" />
                  </VisualBoxView>
                  <VisualBoxView visible={music.mode === MODE.ONE}>
                    <MIconView type="MdRepeatOne" />
                  </VisualBoxView>
                  <VisualBoxView visible={music.mode === MODE.LIST}>
                    <MIconView type="MdTrendingFlat" />
                  </VisualBoxView>
                  <VisualBoxView visible={music.mode === MODE.CIRCLE}>
                    <MIconView type="MdRepeat" />
                  </VisualBoxView>
                </SwitchView>
              </span>
            </Popover>
            <MIconView type="MdSkipNext" onClick={() => {
              if (music.mode === MODE.RANDOM) {
                music.playRandom()
              } else {
                music.playNext()
              }
            }} />
            <MIconView type={musicStore.status === 'play' ? 'IoIosPlay' : 'IoIosPause'} onClick={() => {
              if (musicStore.isLoading) {
                return
              }
              if (musicStore.status === 'play') {
                music.pauseMusic()
              } else {
                music.playMusic('')
              }
            }} />
            <div className="full-width-auto" style={{ paddingLeft: 20 }}>
              <Slider disabled={musicStore.isLoading} value={musicStore.percent} min={0} max={100} onAfterChange={v => {
                console.log(v)
              }} />
            </div>
          </div>
        </SwitchView>
      </div>
    )}
  </Observer>
}

export function createMusicPlayerProvider() {
  return [MusicPlayer, Context]
}

export function useMusicPlayerContext() {
  return useContext(Context)
}