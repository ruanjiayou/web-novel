import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { ActionSheet } from 'antd-mobile'
import { MIconView, VisualBoxView } from 'components'
import { useStoreContext } from 'contexts/store'
import services from 'services'

export default function ({ item, mode = 'normal', order, loader, router, remove, ...props }) {
  const store = useStoreContext()
  const music = store.music
  return <Observer>
    {() => (
      <Fragment>
        <div className="dd-common-alignside" style={{ margin: '0 10px', padding: '10px  0 5px 0', borderBottom: '1px solid #eee' }} {...props} >
          {item.title}
          <div className="dd-common-alignside">
            <MIconView type={item.id === music.currentPlayId ? 'FaPause' : 'FaPlay'} onClick={() => {
              if (item.id === music.currentPlayId) {
                music.pauseMusic()
              } else {
                if (loader) {
                  music.setSheet(loader.items)
                }
                music.playMusic(item.id)
              }
            }} />
            <VisualBoxView visible={mode === 'delete'}>
              <MIconView type="FaTrashAlt" onClick={() => remove(item)} />
            </VisualBoxView>
            <VisualBoxView visible={mode === 'add'}>
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
                  if (index < list.length - 1) {
                    let ssid = result.items[index].id
                    let id = item.id
                    services.addSongToSheet({ params: { ssid, id } })
                  }
                })
              }} />
            </VisualBoxView>
          </div>
        </div>
      </Fragment>
    )}
  </Observer>
}