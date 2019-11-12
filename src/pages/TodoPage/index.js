import React, { useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Button, } from 'antd-mobile'
import { useNaviContext } from 'contexts/navi'
import { useRouterContext } from 'contexts/router'
import MIconView from 'components/MIconView'
import LoaderListView from 'components/LoaderListView'
import TodoListLoader from 'loader/TodoListLoader'
import TodoItemView from 'business/TodoItemView'

export default function SecurePage() {
  const Navi = useNaviContext()
  const router = useRouterContext()
  const todoLoader = TodoListLoader.create()
  const localStore = useLocalStore(() => ({
    type: '1'
  }))
  useEffect(() => {
    if (todoLoader.isEmpty) {
      todoLoader.refresh({ query: { type: localStore.type } })
    }
  })

  return <Observer>{() => (
    <div className="full-height">
      <Navi title="TODO" router={router}>
        <MIconView
          type="FaPlus"
          style={{ display: 'inline-block' }}
          onClick={() => {
            router.pushView('/root/add-todo')
          }}
        />
      </Navi>
      <div className="full-height-auto">
        <LoaderListView
          loader={todoLoader}
          renderItem={(item, selectionId, index) => (
            <TodoItemView item={item} selectionId={selectionId} router={router} />
          )}
        />
      </div>
      <div className="full-height-fix">
        <Button type="primary" onClick={() => {
          localStore.type = localStore.type === '1' ? '' : '1'
          todoLoader.refresh({ query: { type: localStore.type } })
        }}>{localStore.type === '' ? '隐藏已完成' : '显示已完成'}</Button>
      </div>
    </div>
  )}</Observer>
}