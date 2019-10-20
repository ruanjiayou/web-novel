import React, { useEffect, Fragment } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Switch, Tabs, } from 'antd-mobile'
import globalStore from 'global-state'
import { useNaviContext } from 'contexts/navi'
import { useRouterContext } from 'contexts/router'
import MIconView from 'components/MIconView'
import LoaderListView from 'components/LoaderListView'
import TodoListLoader from 'loader/TodoListLoader'
import TodoItemView from 'business/TodoItemView'

export default function SecurePage() {
  const Navi = useNaviContext()
  const router = useRouterContext()
  const todoAllLoader = TodoListLoader.create()
  const todoUnfinishLoader = TodoListLoader.create()
  const todoFinishLoader = TodoListLoader.create()

  const store = useLocalStore(() => ({
    tabIndex: 0,
  }))

  useEffect(() => {
    if (todoAllLoader.isEmpty) {
      todoAllLoader.refresh()
    }
  })

  return <Observer>{() => (
    <Fragment>
      <Navi title="TODO">
        <MIconView
          type="FaPlus"
          style={{ display: 'inline-block' }}
          onClick={() => {
            router.pushView('/root/add-todo')
          }}
        />
      </Navi>
      <div className="full-height-auto">
        <Tabs
          initialPage={store.tabIndex}
          prerenderingSiblingsNumber={false}
          tabs={[
            { title: '全部' },
            { title: '未完成' },
            { title: '已完成' },
          ]}
          onChange={(tab, index) => {
            store.tabIndex = index
            if (index === 1 && todoUnfinishLoader.isEmpty) {
              todoUnfinishLoader.refresh({ query: { type: '1' } })
            }
            if (index === 2 && todoFinishLoader.isEmpty) {
              todoFinishLoader.refresh({ query: { type: '2' } })
            }
          }}
        >
          <div className="full-height">
            <LoaderListView
              loader={todoAllLoader}
              renderItem={(item, selectionId, index) => (
                <TodoItemView item={item} selectionId={selectionId} router={router} />
              )}
            />
          </div>
          <div className="full-height">
            <LoaderListView
              loader={todoUnfinishLoader}
              renderItem={(item, selectionId, index) => (
                <TodoItemView item={item} selectionId={selectionId} router={router} />
              )}
            />
          </div>
          <div className="full-height">
            <LoaderListView
              loader={todoFinishLoader}
              renderItem={(item, selectionId, index) => (
                <TodoItemView item={item} selectionId={selectionId} router={router} />
              )}
            />
          </div>
        </Tabs>
      </div>
    </Fragment>

  )}</Observer>
}