import React, { useEffect } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import services from 'services'
import ResourceModel from 'models/ResourceModel'
import createPageModel from 'page-group-loader-model/BasePageModel'
import { createItemLoader } from 'page-group-loader-model/BaseLoaderModel'
import { FullHeight, FullHeightAuto, FullHeightFix, FullWidthFix, FullWidth } from 'components/common'

const model = createPageModel({})

function View({ self, router, Navi, params }) {
  const local = useLocalStore(() => ({
    loader: null,
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
    if (local.loader.isEmpty) {
      local.loader.refresh()
    }
  });
  return <Observer>
    {() => (
      <FullHeight>
        <Navi title="音乐" router={router} />
        <FullHeightAuto>

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