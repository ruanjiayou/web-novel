import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { MIconView, VisualBoxView } from 'components'
import { useStoreContext } from 'contexts/store'
import { useRouterContext } from 'contexts'
import services from 'services'
import Recorder from 'utils/cache'

const musicRecorder = new Recorder('music')

export default function ({ item, mode = 'add', loader, ...props }) {
  const router = useRouterContext()
  const store = useStoreContext()
  const music = store.music
  return <Observer>
    {() => (
      <Fragment>
        <div className="dd-common-alignside" style={{
          padding: '10px  10px 5px 10px',
          backgroundColor: item.id === music.currentId ? '#eaf1f7' : '',
          borderBottom: '1px solid #eee',
          borderLeft: item.id === music.currentId ? '2px solid #0094fd' : 'none',
        }}
          {...props} >
          <div style={{ flex: 1, color: music.currentId === item.id ? '#33a3f4' : '' }} onClick={async (e) => {
            if (music.currentId === item.id) return;
            const data = item.toJSON()
            e.preventDefault()
            e.stopPropagation()
            const old = await musicRecorder.getValue(data.id)
            if (!old) {
              musicRecorder.setValue(data.id, data, { id: '' })
            }
            music.loadHistory()
            music.play(data)
            if (router.lastView !== 'MusicPlayer') {
              router.pushView('MusicPlayer', { id: data.id })
            } else {
              router.replaceView('MusicPlayer', { id: data.id })
            }
          }}>
            {item.title}
          </div>
          <div className="dd-common-alignside">
            <VisualBoxView visible={mode === 'delete'}>
              <MIconView type="FaTrashAlt" onClick={async (e) => {
                e.preventDefault()
                e.stopPropagation()
                try {
                  await services.removeFromSheet({ params: { id: loader.item.id }, data: { list: [item.id] } })
                  loader.item.removeById(item.id)
                } catch (e) {

                }
              }} />
            </VisualBoxView>
          </div>
        </div>
      </Fragment>
    )}
  </Observer>
}