import React, { Fragment, useCallback } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Tabs } from 'antd-mobile'
import { MarkListLoader } from 'loader'
import renderBlank from 'components/EmptyView';
import { LoaderListView } from 'components';
import ResourceItem from 'business/ResourceItem'
import { useEffectOnce } from 'react-use';
import createPageModel from 'page-group-loader-model/BasePageModel'
import { FullHeight, FullHeightFix, FullHeightAuto } from 'components/common';
import { useNaviContext, useRouterContext } from 'contexts';

const model = createPageModel({
  images: MarkListLoader,
  novels: MarkListLoader,
  articles: MarkListLoader,
  songs: MarkListLoader,
})
const tabs = [
  { title: '图片', },
  { title: '文章', },
  { title: '小说', },
  { title: '音乐', },
]

function View({ self }) {
  const Navi = useNaviContext()
  const router = useRouterContext()
  useEffectOnce(() => {
    self.images.setOption({ type: 'image' })
    self.articles.setOption({ type: 'article' })
    self.novels.setOption({ type: 'novel' })
    self.songs.setOption({ type: 'music' })
    self.images.refresh({})
  })
  const onChange = useCallback((tab, index) => {
    if (index == 1 && self.articles.isEmpty) {
      self.articles.refresh({ query: { type: 'article' } })
    }
    if (index == 2 && self.novels.isEmpty) {
      self.novels.refresh({ query: { type: 'novel' } })
    }
    if (index == 3 && self.songs.isEmpty) {
      self.songs.refresh({ query: { type: 'music' } })
    }
  })
  return <FullHeight>
    <Navi title="收藏" />
    <FullHeightAuto>
      <Observer>{() => {
        return <Tabs tabs={tabs} initialPage={0} onChange={onChange}>
          <LoaderListView loader={self.images} renderItem={(item, selectionId, index) => <ResourceItem
            key={index}
            item={item}
            loader={self.images}
            selectionId={selectionId}
          />}></LoaderListView>
          <LoaderListView loader={self.articles} renderItem={(item, selectionId, index) => <ResourceItem
            type=""
            key={index}
            item={item}
            loader={self.articles}
            selectionId={selectionId}
          />}></LoaderListView>
          <LoaderListView loader={self.novels} renderItem={(item, selectionId, index) => <ResourceItem
            type=""
            key={index}
            item={item}
            loader={self.novels}
            selectionId={selectionId}
          />}></LoaderListView>
          <LoaderListView loader={self.songs} renderItem={(item, selectionId, index) => <ResourceItem
            type=""
            key={index}
            item={item}
            loader={self.songs}
            selectionId={selectionId}
          />}></LoaderListView>
        </Tabs>
      }}</Observer>
    </FullHeightAuto>
  </FullHeight>
}


export default {
  group: {
    view: 'Marked',
  },
  View,
  model,
}