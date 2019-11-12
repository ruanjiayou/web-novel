import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { ActionSheet } from 'antd-mobile'
import { useStoreContext } from 'contexts/store'
import MIconView from 'components/MIconView'
import services from 'services'
import events from 'utils/events'

export default function ({ item, router, ...props }) {
  const store = useStoreContext()
  const music = store.music
  return <Observer>
    {() => (
      <Fragment>
        <div className="dd-common-alignside" style={{ margin: '0 10px', padding: '10px  0 5px 0', borderBottom: '1px solid #eee' }} {...props} >
          {item.title}
          <div  className="dd-common-alignside">
            <MIconView type="FaPlay" onClick={() => {
              events.emit(music.event.PLAY_SINGLE, store.app.baseURL + item.url, item.order)
            }} />
            <MIconView type="FaPlus" onClick={async (e) => {
              e.preventDefault()
              e.stopPropagation()
              const result = await services.getSongSheets({})
              const list = result.items.map(it => it.title)
              ActionSheet.showActionSheetWithOptions({
                options: [...list, '取消'],
                message: '添加到歌单',
                maskClosable: true,
                cancelButtonIndex: list.length - 1
              }, index => {
                let ssid = result.items[index].id
                let id = item.id
                services.addSongToSheet({ params: { ssid, id } })
              })
            }} />
          </div>
        </div>
      </Fragment>
    )}
  </Observer>
}