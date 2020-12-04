import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { ActionSheet } from 'antd-mobile'
import { MIconView, VisualBoxView } from 'components'
import { useStoreContext } from 'contexts/store'
import services from 'services'

export default function ({ item, mode = 'add', loader, ...props }) {
  const store = useStoreContext()
  const music = store.music
  return <Observer>
    {() => (
      <Fragment>
        <div className="dd-common-alignside" style={{ margin: '0 10px', padding: '10px  0 5px 0', backgroundColor: item.id === music.currentId ? 'grey' : '', borderBottom: '1px solid #eee' }} {...props} >
          {item.title}
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
            <VisualBoxView visible={mode === 'add'}>
              <MIconView type="FaPlus" onClick={async (e) => {
                e.preventDefault()
                e.stopPropagation()
                const result = await services.getSheets({ query: { type: 'song' } })
                const list = result.items.map(it => it.title)
                ActionSheet.showActionSheetWithOptions({
                  options: [...list, '取消'],
                  message: '添加到歌单',
                  maskClosable: true,
                  cancelButtonIndex: list.length - 1
                }, index => {
                  if (index <= list.length - 1) {
                    services.addToSheet({ params: result.items[index], data: { list: [{ title: item.title, poster: item.poster, id: item.id, url: item.url }] } })
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