import React, { Fragment } from 'react';
import { Observer } from 'mobx-react-lite';
import { Radio, Switch } from 'antd-mobile';

import createPageModel from 'page-group-loader-model/BasePageModel';
import { UserAreaView } from 'components/index.js';

const model = createPageModel({});

function View({ self, router, store, Navi }) {
  return (
    <Observer>
      {() => (
        <UserAreaView>
          <Navi title="安全" router={router} />
          <div className="full-height-auto">
            <div
              className="dd-common-alignside"
              style={{ padding: '15px 20px', backgroundColor: 'white' }}
            >
              密码锁
              <Switch
                checked={store.app.config.isLockerOpen}
                onChange={(checked) => store.app.setLocker(checked)}
              />
            </div>
            <div
              className="dd-common-alignside"
              style={{ padding: '15px 20px', backgroundColor: 'white' }}
            >
              环境
              <div className="dd-common-alignside">
                <Radio name='env' checked={store.app.env === 'test'} onChange={e => {
                  store.app.setENV('test')
                  window.location.reload();
                }}>
                  测试
                </Radio>
                &nbsp;&nbsp;
                <Radio name='env' checked={store.app.env === 'development'} onChange={e => {
                  store.app.setENV('development')
                  window.location.reload();
                }}>
                  开发
                </Radio>
                &nbsp;&nbsp;
                <Radio name='env' checked={store.app.env === 'production'} onChange={e => {
                  store.app.setENV('production')
                  window.location.reload();
                }}>
                  正式
                </Radio>
              </div>
            </div>
            <div
              className="dd-common-alignside"
              style={{ padding: '15px 20px', backgroundColor: 'white' }}
            >
              调试
              <Switch
                checked={store.app.showDebug}
                onChange={(checked) => store.app.toggleDebug()}
              />
            </div>
            <div
              className="dd-common-alignside"
              style={{ padding: '15px 20px', backgroundColor: 'white' }}
            >
              语音
              <Switch
                checked={store.app.showSpeaker}
                onChange={(checked) => store.app.toggleSpeaker()}
              />
            </div>
            <div
              className="dd-common-alignside"
              style={{ padding: '15px 20px', backgroundColor: 'white' }}
            >
              音乐
              <Switch
                checked={store.app.showMusic}
                onChange={(checked) => store.app.toggleMusic()}
              />
            </div>
          </div>
        </UserAreaView>
      )}
    </Observer>
  );
}

export default {
  group: {
    view: 'UserSecure',
  },
  model,
  View,
};
