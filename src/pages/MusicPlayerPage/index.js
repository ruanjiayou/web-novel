import React, { useEffect } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { SwipeAction } from 'antd-mobile'
import services from 'services'
import ResourceModel from 'models/ResourceModel'
import ResourceItem from 'business/ResourceItem'
import createPageModel from 'page-group-loader-model/BasePageModel'
import { createItemLoader, createItemsLoader } from 'page-group-loader-model/BaseLoaderModel'
import { FullHeight, FullHeightAuto, FullHeightFix, FullWidthFix, FullWidth } from 'components/common'
import { LoaderListView, AutoCenterView } from 'components'
import Recorder from 'utils/cache'

const musicRecorder = new Recorder('music')
const model = createPageModel({})

function View({ self, router, Navi, params }) {
  const local = useLocalStore(() => ({
    loader: null,
    history: createItemsLoader(ResourceModel, async function () {
      const items = await musicRecorder.getAll()
      return {
        items: items.map(item => {
          return item.data;
        }),
        ended: true,
      };
    }).create(),
    id: params.id,
  }));
  useEffectOnce(() => {
    const mop = document.getElementById('mop');
    const mo = document.getElementById('musicOperation');
    if (mo) {
      mop.append(mo);
    }
    local.loader = createItemLoader(ResourceModel, function () {
      return services.getResource({ params: { id: local.id } });
    }).create();
    return function () {
      const musicOpBox = document.getElementById('musicOpBox');
      if (musicOpBox) {
        musicOpBox.append(mo)
      }
    }
  });
  useEffect(() => {
    local.history.refresh()
  }, [params.id]);
  return <Observer>
    {() => (
      <FullHeight>
        <Navi title="音乐" router={router} />
        <FullHeightAuto>
          <LoaderListView
            loader={local.history}
            renderEmpty={(
              <AutoCenterView>
                <span>没有播放记录</span>
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
                    musicRecorder.removeKey(item.id);
                    local.history.remove(index);
                  },
                  style: { backgroundColor: 'red', color: 'white' }
                }]}
              >
                <ResourceItem
                  item={item}
                  mode=''
                  router={router}
                  sectionId={sectionId}
                />
              </SwipeAction>
            )}
          />
        </FullHeightAuto>
        <FullWidth id="mop"></FullWidth>
      </FullHeight>
    )}
  </Observer>

}

export default {
  group: {
    view: 'MusicPlayer',
  },
  View,
  model,
}