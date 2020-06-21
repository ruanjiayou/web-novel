import React, { useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Button, } from 'antd-mobile'
import { useNaviContext, useRouterContext, useStoreContext } from 'contexts'
import { MIconView, LoaderListView, AutoCenterView, VisualBoxView } from 'components'
import TodoListLoader from 'loader/TodoListLoader'
import TodoItemView from 'business/TodoItemView'

export default function SecurePage() {
  const globalStore = useStoreContext()
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
        <VisualBoxView visible={globalStore.app.isLogin}>
          <MIconView
            type="FaPlus"
            style={{ display: 'inline-block' }}
            onClick={() => {
              router.pushView('add-todo')
            }}
          />
        </VisualBoxView>
      </Navi>
      <div className="full-height-auto">
        <LoaderListView
          loader={todoLoader}
          renderEmpty={(
            <AutoCenterView>
              <Button type="primary" inline onClick={() => { router.pushView('/auth/login') }}>登录</Button>
            </AutoCenterView>
          )}
          renderItem={(item, selectionId, index) => (
            <TodoItemView item={item} selectionId={selectionId} router={router} />
          )}
        />
      </div>
      <div className="full-height-fix" style={{ padding: '10px 20px' }}>
        <VisualBoxView visible={globalStore.app.isLogin}>
          <Button type="primary" onClick={() => {
            localStore.type = localStore.type === '1' ? '' : '1'
            todoLoader.refresh({ query: { type: localStore.type } })
          }}>{localStore.type === '' ? '隐藏已完成' : '显示已完成'}</Button>
        </VisualBoxView>

      </div>
    </div>
  )}</Observer>
}