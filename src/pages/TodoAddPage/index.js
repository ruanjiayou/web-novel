import React, { Fragment, useEffect } from 'react'
import { Observer, useLocalStore, } from 'mobx-react-lite'
import { ActivityIndicator, Toast } from 'antd-mobile'
import { useNaviContext } from 'contexts/navi'
import { useRouterContext } from 'contexts/router'
import MIconView from 'components/MIconView'
import services from 'services'

export default function TodoAddPage() {
  const Navi = useNaviContext()
  const router = useRouterContext()
  const store = useLocalStore(() => ({
    loading: false,
  }))
  return <Observer>{() => (
    <Fragment>
      <Navi title="添加" />
      <div className="full-height-auto">

      </div>
      <ActivityIndicator animating={store.loading} />
      <div className="full-height-fix">
        <MIconView type="FaCheck" onClick={async () => {
          store.loading = true
          try {
            await services.createTodo({
              data: {
                title: 'title',
                content: 'content',
                type: 'test',
                startedAt: new Date(),
                endedAt: new Date(),
              }
            })
          } catch (err) {

          } finally {
            store.loading = false
            Toast.info('result', 2, () => {
              router.back()
            })
          }
        }} />
      </div>
    </Fragment>
  )}</Observer>
}