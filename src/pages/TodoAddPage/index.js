import React, { Fragment } from 'react'
import { Observer, useLocalStore, } from 'mobx-react-lite'
import { ActivityIndicator, Toast, List, InputItem, TextareaItem, DatePicker, Picker, Switch } from 'antd-mobile'
import { useNaviContext, useRouterContext } from 'contexts'
import services from 'services'

export default function TodoAddPage() {
  const Navi = useNaviContext()
  const router = useRouterContext()
  const params = router.params
  const todo = router.getStateKey('data')
  const store = useLocalStore(() => ({
    loading: false,
    title: params.id ? todo.title : '',
    content: params.id ? todo.content : '',
    type: params.id ? todo.type : 'work',
    priority: params.id ? todo.priority : '',
    startedAt: params.id ? todo.startedAt : null,
    endedAt: params.id ? todo.endedAt : null,
    isDelay: params.id ? todo.isDelay : false,
    isFinish: params.id ? todo.isFinish : false,
  }))
  return <Observer>{() => (
    <Fragment>
      <Navi title={params.id ? '修改' : '添加'} router={router} />
      <div className="full-height-auto">
        <List>
          <InputItem type="text" value={store.title} onChange={value => store.title = value}>标题</InputItem>
          <Picker extra={'请选择'} value={[store.type]} data={[
            { label: '生活', value: 'life' },
            { label: '工作', value: 'work' },
            { label: '设计', value: 'design' },
          ]} onChange={value => store.type = value[0]}>
            <List.Item>类型</List.Item>
          </Picker>
          <TextareaItem title="详情" value={store.content} autoHeight onChange={value => store.content = value}></TextareaItem>
          <Picker extra={'请选择'} value={[store.priority]} data={[
            { label: '不重要不紧急', value: 1 },
            { label: '重要不紧急', value: 2 },
            { label: '不重要紧急', value: 3 },
            { label: '重要紧急', value: 4 },
          ]} onChange={value => {
            store.priority = value[0]
          }}>
            <List.Item>优先级</List.Item>
          </Picker>
          <DatePicker value={store.startedAt} onChange={value => store.startedAt = value}>
            <List.Item>开始时间</List.Item>
          </DatePicker>
          <DatePicker value={store.endedAt} onChange={value => store.endedAt = value}>
            <List.Item>结束时间</List.Item>
          </DatePicker>
          <List.Item>
            <div className="dd-common-alignside">
              <span>是否推迟</span>
              <Switch checked={store.isDelay} onChange={value => store.isDelay = value} />
            </div>
          </List.Item>
          <List.Item>
            <div className="dd-common-alignside">
              <span>是否完成</span>
              <Switch checked={store.isFinish} onChange={value => store.isFinish = value} />
            </div>
          </List.Item>
        </List>
      </div>
      <ActivityIndicator animating={store.loading} />
      <div className="full-width" style={{ height: 40, borderTop: '1px solid #eee' }}>
        <div className="full-width-auto dd-common-centerXY" style={{ backgroundColor: 'white' }}>取消</div>
        <div className="full-width-auto dd-common-centerXY" style={{ backgroundColor: '#30a6fb', color: 'white' }} onClick={async () => {
          store.loading = true
          try {
            if (params.id) {
              await services.updateTodo({ params, data: store })
            } else {
              await services.createTodo({
                data: {
                  title: store.title,
                  content: store.content,
                  type: store.type,
                  priority: store.priority,
                  startedAt: store.startedAt,
                  endedAt: store.endedAt,
                }
              })
            }
          } catch (err) {

          } finally {
            store.loading = false
            Toast.info('编辑成功', 2, () => {
              router.back()
            })
          }
        }}>{params.id ? '修改' : '添加'}</div>
      </div>
    </Fragment>
  )}</Observer>
}