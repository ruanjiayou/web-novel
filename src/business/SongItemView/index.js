import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import MIconView from 'components/MIconView'
import events from 'utils/events'
import { useStoreContext } from 'contexts/store'

export default function ({ item, router, ...props }) {
  const store = useStoreContext()
  const music = store.music
  return <Observer>
    {() => (
      <Fragment>
        <div className="dd-common-alignside" style={{ margin: '0 10px', padding: '10px  0 5px 0', borderBottom: '1px solid #eee' }} {...props} >
          {item.title}
          <MIconView type={item.playing ? 'FaPause' : 'FaPlay'} onClick={() => {
            item.toggleStatus()
            events.emit(music.event.PLAY, store.app.baseURL + item.url, item.order)
          }} />
        </div>
      </Fragment>
    )}
  </Observer>
}