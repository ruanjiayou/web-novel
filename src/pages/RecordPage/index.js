import React, { Fragment } from 'react'
import { useEffectOnce } from 'react-use'
import { SwipeAction } from 'antd-mobile'
import { Observer, useLocalStore } from 'mobx-react-lite'

import RecordBookItem from 'business/ResourceItem/RecordBookItem'
import { LoaderListView, AutoCenterView } from 'components'
import Recorder from 'utils/cache'

import ResourceModel from 'models/ResourceModel'
import createPageModel from 'page-group-loader-model/BasePageModel'
import { createItemsLoader } from 'page-group-loader-model/BaseLoaderModel'
const bookRecorder = new Recorder('book')

const model = createPageModel({})

function View({ self, router, store, Navi }) {
  // TODO: loader返回后丢失数据
  const loader = createItemsLoader(ResourceModel, async () => {
    const results = await bookRecorder.getAll()
    return {
      items: results.map(item => {
        return item.data;
      }),
      ended: true,
    };
  }).create();
  const localStore = useLocalStore(() => ({
    loading: false,

  }))

  useEffectOnce(() => {
    if (loader.isEmpty) {
      loader.refresh()
    }
  })

  return <Observer>{
    () => {
      return <Fragment>
        <Navi title="记录" />
        <LoaderListView
          loader={loader}
          renderEmpty={(
            <AutoCenterView>
              <span>没有阅读记录</span>
            </AutoCenterView>
          )}
          renderItem={(item, sectionId, index) => (
            <SwipeAction
              key={item.id}
              right={[{
                text: '删除',
                onPress: (e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  bookRecorder.removeKey(item.id);
                  loader.remove(index);
                },
                style: { backgroundColor: 'red', color: 'white' }
              }]}
            >
              <RecordBookItem
                item={item}
                router={router}
                sectionId={sectionId}
                toggleLoading={() => localStore.loading = !localStore.loading}
              />
            </SwipeAction>
          )}
        />
      </Fragment>
    }
  }</Observer>
}

export default {
  group: {
    view: 'Record',
  },
  View,
  model,
}