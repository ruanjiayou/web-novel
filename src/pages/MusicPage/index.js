import React, { useRef } from 'react';
import { useEffectOnce } from 'react-use';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { Modal, InputItem, List, Button } from 'antd-mobile';

import { RenderGroups } from 'group';
import { SheetListLoader, GroupTreeLoader } from 'loader';
import { LoaderListView, MIconView } from 'components';
import createPageModel from 'page-group-loader-model/BasePageModel';
import services from 'services';

const model = createPageModel({
  SheetListLoader,
  GroupTreeLoader,
});

function View({ self, router, Navi, children }) {
  const loader = self.GroupTreeLoader;
  const refTitle = useRef(null);
  const refDesc = useRef(null);
  const local = useLocalStore(() => ({
    loading: false,
    showModal: false,
    closeModal() {
      this.showModal = false;
    },
  }));
  useEffectOnce(() => {
    if (loader.isEmpty) {
      loader.refresh({});
    }
  });
  return (
    <Observer>
      {() => (
        <div className="full-height">
          <RenderGroups
            loader={loader}
            group={{ name: 'music' }}
            style={{ maxWidth: '50%' }}
          />
          {/* <Navi title="歌单列表" router={router}>
          <span style={{ paddingRight: 10 }} onClick={e => { local.showModal = true }}>创建</span>
        </Navi>
        <div className="full-height-auto">
          <LoaderListView
            loader={loader}
            renderItem={(item, selectionId, index) => (
              <div key={index}
                className="dd-common-alignside"
                style={{ margin: '0 10px', padding: '10px  0 5px 0', borderBottom: '1px solid #eee' }}
                onClick={() => { router.pushView('SongSheet', { id: item.id }) }}
              >
                {item.title}
                <MIconView type="FaAngleRight" />
              </div>
            )}
          />
        </div>
        <Modal
          popup
          visible={local.showModal}
          onClose={local.closeModal}
          animationType="slide-up"
        >
          <List renderHeader={() => <div>创建歌单</div>} className="popup-list">
            <InputItem ref={ref => refTitle.current = ref} placeholder="">名称</InputItem>
            <InputItem ref={ref => refDesc.current = ref} placeholder="">描述</InputItem>
            <List.Item>
              <Button type="primary" loading={local.loading} onClick={async () => {
                let title = refTitle.current.state.value
                let desc = refDesc.current.state.value
                const data = { title, desc, type: 'song' }
                try {
                  local.loading = true
                  await services.createSheet({ data })
                } finally {
                  local.loading = false
                  local.closeModal()
                }
              }}>创建</Button>
            </List.Item>
          </List>
        </Modal> */}
        </div>
      )}
    </Observer>
  );
}

export default {
  group: {
    view: 'music',
  },
  View,
  model,
};
