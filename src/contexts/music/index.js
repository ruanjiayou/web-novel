import React, { useContext, useState, useRef } from 'react'
import store from '../../global-state'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Popover } from 'antd-mobile'
import events from 'utils/events'
import MIconView from 'components/MIconView'
import VisibleBoxView from 'components/VisualBoxView'

// 上下文context.避免react多级一直传props
const Context = React.createContext(null)

function MusicPlayer(prop) {
  const player = useRef(null)
  const music = store.music
  const MODE = music.type
  const EVENT = music.event
  const musicStore = useLocalStore(() => ({
    showModePop: false,
  }))
  events.on(EVENT.PLAY, (url, order) => {
    music.setUrl(url, order)
  })
  events.on(EVENT.PLAY_SINGLE, (url, order) => {
    music.setUrl(url, order)
  })
  events.on(EVENT.PAUSE, () => {
    player.current.pause()
  })
  return <Observer>
    {() => (
      <div className="full-width">
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
          music.playNext()
        }} />
        <audio ref={value => { player.current = value }}
          onLoadedData={() => {
            if (player.current) {
              player.current.play()
            }
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
          src={music.url} controls="controls" preload="true"></audio>
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