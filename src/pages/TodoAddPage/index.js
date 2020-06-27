import React, { Fragment } from 'react'
import { Observer, useLocalStore, } from 'mobx-react-lite'
import { ActivityIndicator, Toast, List, InputItem, TextareaItem, DatePicker, Picker, Switch } from 'antd-mobile'

import createPageModel from 'page-group-loader-model/BasePageModel'

const model = createPageModel({})

function View({self, router, params, store, services, Navi}) {
  const todo = router.getStateKey('data')
  const local = useLocalStore(() => ({
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
          <InputItem type="text" value={local.title} onChange={value => local.title = value}>标题</InputItem>
          <Picker extra={'请选择'} value={[local.type]} data={[
            { label: '生活', value: 'life' },
            { label: '工作', value: 'work' },
            { label: '设计', value: 'design' },
          ]} onChange={value => local.type = value[0]}>
            <List.Item>类型</List.Item>
          </Picker>
          <TextareaItem title="详情" value={local.content} autoHeight onChange={value => local.content = value}></TextareaItem>
          <Picker extra={'请选择'} value={[local.priority]} data={[
            { label: '不重要不紧急', value: 1 },
            { label: '重要不紧急', value: 2 },
            { label: '不重要紧急', value: 3 },
            { label: '重要紧急', value: 4 },
          ]} onChange={value => {
            local.priority = value[0]
          }}>
            <List.Item>优先级</List.Item>
          </Picker>
          <DatePicker value={local.startedAt} onChange={value => local.startedAt = value}>
            <List.Item>开始时间</List.Item>
          </DatePicker>
          <DatePicker value={local.endedAt} onChange={value => local.endedAt = value}>
            <List.Item>结束时间</List.Item>
          </DatePicker>
          <List.Item>
            <div className="dd-common-alignside">
              <span>是否推迟</span>
              <Switch checked={local.isDelay} onChange={value => local.isDelay = value} />
            </div>
          </List.Item>
          <List.Item>
            <div className="dd-common-alignside">
              <span>是否完成</span>
              <Switch checked={local.isFinish} onChange={value => local.isFinish = value} />
            </div>
          </List.Item>
        </List>
      </div>
      <ActivityIndicator animating={local.loading} />
      <div className="full-width" style={{ height: 40, borderTop: '1px solid #eee' }}>
        <div className="full-width-auto dd-common-centerXY" style={{ backgroundColor: 'white' }}>取消</div>
        <div className="full-width-auto dd-common-centerXY" style={{ backgroundColor: '#30a6fb', color: 'white' }} onClick={async () => {
          local.loading = true
          try {
            if (params.id) {
              await services.updateTodo({ params, data: local })
            } else {
              await services.createTodo({
                data: {
                  title: local.title,
                  content: local.content,
                  type: local.type,
                  priority: local.priority,
                  startedAt: local.startedAt,
                  endedAt: local.endedAt,
                }
              })
            }
          } catch (err) {

          } finally {
            local.loading = false
            Toast.info('编辑成功', 2, () => {
              router.back()
            })
          }
        }}>{params.id ? '修改' : '添加'}</div>
      </div>
    </Fragment>
  )}</Observer>
}

export default {
  group: {
    view: 'TodoAdd',
  },
  View,
  model,
}