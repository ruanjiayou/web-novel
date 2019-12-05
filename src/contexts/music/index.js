import React, { useContext, useRef } from 'react'
import store from '../../global-state'
import storage from 'utils/storage'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Popover } from 'antd-mobile'
import events from 'utils/events'
import MIconView from 'components/MIconView'
import VisibleBoxView from 'components/VisualBoxView'
import Dragger from 'components/Dragger'

// 上下文context.避免react多级一直传props
const Context = React.createContext(null)

function MusicPlayer() {
  const player = useRef(null)
  const music = store.music
  const MODE = music.type
  const EVENT = music.event
  const pos = storage.getValue('music')
  const musicStore = useLocalStore(() => ({
    url: '',
    showModePop: false,
    top: pos ? pos.top : 210,
    left: pos ? pos.left : 100,
  }))
  let timer = null
  events.on(EVENT.PLAY, (id) => {
    if (id === '') {
      return
    }
    musicStore.url = store.app.baseURL + music.getUrlById(id)
    setTimeout(() => {
      // TODO: 请求中间态处理 不停重试,除非遇到错误
      if (player.current) {
        player.current.play()
      }
    }, 100)
  })
  events.on(EVENT.PAUSE, () => {
    player.current.pause()
  })
  return <Observer>
    {() => (
      <div style={{
        position: 'fixed',
        zIndex: 10,
        top: musicStore.top,
        left: musicStore.left,
      }} className="full-width">
        <Dragger cb={sstore => {
          musicStore.left = Math.max(0, sstore.left + sstore.offsetLeft)
          musicStore.top = Math.max(0, sstore.top + sstore.offsetTop)
          clearTimeout(timer)
          timer = null
          timer = setTimeout(() => {
            storage.setValue('music', { left: musicStore.left, top: musicStore.top })
          }, 100)
        }}>
          <MIconView type="FaArrowsAlt" />
        </Dragger>
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
            <VisibleBoxView visible={music.mode === MODE.RANDOM}>
              <MIconView type="MdShuffle" />
            </VisibleBoxView>
            <VisibleBoxView visible={music.mode === MODE.ONE}>
              <MIconView type="MdRepeatOne" />
            </VisibleBoxView>
            <VisibleBoxView visible={music.mode === MODE.LIST}>
              <MIconView type="MdTrendingFlat" />
            </VisibleBoxView>
            <VisibleBoxView visible={music.mode === MODE.CIRCLE}>
              <MIconView type="MdRepeat" />
            </VisibleBoxView>
          </span>
        </Popover>
        <MIconView type="MdSkipNext" onClick={() => {
          if (music.mode === MODE.RANDOM) {
            music.playRandom()
          } else {
            music.playNext()
          }
        }} />
        <audio ref={value => { player.current = value }}
          onCanPlay={() => {
          }}
          onLoadedMetadata={() => {
          }
          }
          onLoadedData={() => {
          }}
          onProgress={() => {
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
          src={musicStore.url} controls="controls" preload="true"></audio>
      </div>
    )}
  </Observer>
}

export function createProvider() {
  return [MusicPlayer, Context]
}

export function useMusicPlayerContext() {
  return useContext(Context)
}