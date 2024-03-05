import React, { Fragment } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import {
  ActivityIndicator,
  Toast,
  List,
  InputItem,
  TextareaItem,
  DatePicker,
  Picker,
  Switch,
} from 'antd-mobile';

import createPageModel from 'page-group-loader-model/BasePageModel';
import { useEffectOnce } from 'react-use';
import TodoLoader from 'loader/TodoLoader';
import {
  FullHeight,
  FullHeightAuto,
  FullHeightFix,
  FullWidth,
  FullWidthAuto,
  FullWidthFix,
} from 'components/common';

const model = createPageModel({});

function View({ self, router, params, store, services, Navi }) {
  const loader = TodoLoader.create({ attrs: {} });
  const local = useLocalStore(() => ({
    loading: false,
    data: {},
  }));
  useEffectOnce(() => {
    if (params.id) {
      loader.refresh({ params });
    }
  });
  return (
    <Observer>
      {() => (
        <FullHeight>
          <Navi title={params.id ? '修改' : '添加'} router={router} />
          <FullHeightAuto>
            {loader.isEmpty ? (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <ActivityIndicator animating={true} text="加载中..." />
              </div>
            ) : loader.isError ? (
              <span>加载失败</span>
            ) : (
              <List>
                <InputItem
                  type="text"
                  value={local.data.title}
                  onChange={(value) => (local.data.title = value)}
                >
                  标题
                </InputItem>
                <Picker
                  extra={'请选择'}
                  value={[local.data.type]}
                  data={[
                    { label: '生活', value: 'life' },
                    { label: '工作', value: 'work' },
                    { label: '设计', value: 'design' },
                  ]}
                  onChange={(value) => (local.data.type = value[0])}
                >
                  <List.Item>类型</List.Item>
                </Picker>
                <TextareaItem
                  title="详情"
                  value={local.data.content}
                  autoHeight
                  onChange={(value) => (local.data.content = value)}
                ></TextareaItem>
                <Picker
                  extra={'请选择'}
                  value={[local.data.priority]}
                  data={[
                    { label: '不重要不紧急', value: 1 },
                    { label: '重要不紧急', value: 2 },
                    { label: '不重要紧急', value: 3 },
                    { label: '重要紧急', value: 4 },
                  ]}
                  onChange={(value) => {
                    local.data.priority = value[0];
                  }}
                >
                  <List.Item>优先级</List.Item>
                </Picker>
                <DatePicker
                  value={local.data.startedAt}
                  onChange={(value) => (local.data.startedAt = value)}
                >
                  <List.Item>开始时间</List.Item>
                </DatePicker>
                <DatePicker
                  value={local.data.endedAt}
                  onChange={(value) => (local.data.endedAt = value)}
                >
                  <List.Item>结束时间</List.Item>
                </DatePicker>
                <List.Item>
                  <div className="dd-common-alignside">
                    <span>是否推迟</span>
                    <Switch
                      checked={local.data.isDelay}
                      onChange={(value) => (local.data.isDelay = value)}
                    />
                  </div>
                </List.Item>
                <List.Item>
                  <div className="dd-common-alignside">
                    <span>是否完成</span>
                    <Switch
                      checked={local.data.isFinish}
                      onChange={(value) => (local.data.isFinish = value)}
                    />
                  </div>
                </List.Item>
              </List>
            )}
          </FullHeightAuto>
          <ActivityIndicator animating={local.loading} />
          <FullWidth
            style={{
              height: 40,
              borderTop: '1px solid #eee',
              display: loader.isEmpty ? 'none' : '',
            }}
          >
            <FullWidthAuto style={{ backgroundColor: 'white' }}>
              取消
            </FullWidthAuto>
            <FullWidthAuto
              style={{ backgroundColor: '#30a6fb', color: 'white' }}
              onClick={async () => {
                local.loading = true;
                try {
                  if (params.id) {
                    await services.updateTodo({ params, data: local.data });
                  } else {
                    await services.createTodo({
                      data: local.data,
                    });
                  }
                } catch (err) {
                } finally {
                  local.loading = false;
                  Toast.info('编辑成功', 2, () => {
                    router.back();
                  });
                }
              }}
            >
              {params.id ? '修改' : '添加'}
            </FullWidthAuto>
          </FullWidth>
        </FullHeight>
      )}
    </Observer>
  );
}

export default {
  group: {
    view: 'TodoInfo',
  },
  View,
  model,
};
