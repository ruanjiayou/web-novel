import React, { Fragment, useCallback, useRef } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import createPageModel from 'page-group-loader-model/BasePageModel';
import {
  FullHeight,
  FullHeightFix,
  FullHeightAuto,
  FullWidth,
  FullWidthAuto,
  FullWidthFix,
} from 'components/common';
import { useRouterContext } from 'contexts';
import { useEffectOnce } from 'react-use';
import storage from 'utils/storage';
import { WordItem } from './style';
import { MIconView, UserAreaView } from 'components';

const model = createPageModel({});

function View({ self, store, params }) {
  const router = useRouterContext();
  const local = useLocalStore(() => ({
    hotWords: [],
    historyWords: [],
    search: params.search || '',
    tag: params.tag || '',
  }));
  const iRef = useRef(null);
  useEffectOnce(() => {
    const words = storage.getValue('historyWords') || '';
    local.historyWords = words.split(',').filter((w) => w !== '');
    return () => {};
  });
  return (
    <Observer>
      {() => (
        <UserAreaView>
          <FullWidth style={{ height: 50 }}>
            <FullWidthFix></FullWidthFix>
            <FullWidthAuto
              style={{
                marginLeft: 10,
                position: 'relative',
                display: 'flex',
                backgroundColor: '#ccc',
                alignItems: 'center',
                border: '0 none',
                width: '100%',
                borderRadius: 5,
                padding: '5px 8px',
              }}
            >
              {local.tag && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 20,
                    borderRadius: 10,
                    padding: '0 5px',
                    border: '1px solid #999',
                  }}
                >
                  {local.tag}
                  <MIconView
                    type="IoIosClose"
                    onClick={(e) => {
                      local.tag = '';
                      iRef.current && iRef.current.focus();
                    }}
                  />
                </div>
              )}
              <input
                defaultValue={local.search}
                autoFocus
                ref={(ref) => (iRef.current = ref)}
                style={{
                  backgroundColor: '#ccc',
                  height: 30,
                  marginLeft: 10,
                  flex: 1,
                  boxSizing: 'border-box',
                  border: '0 none',
                  borderBottom: '1px solid #999',
                }}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    const str = iRef.current ? iRef.current.value : '';
                    if (str) {
                      local.historyWords.push(str);
                      storage.setValue(
                        'historyWords',
                        local.historyWords.join(','),
                      );
                    }
                    router.replaceView('SearchResult', {
                      title: str,
                      tag: local.tag,
                    });
                  }
                }}
              />
            </FullWidthAuto>
            <div
              style={{ color: '#3e3e3e', padding: '0 5px' }}
              onClick={() => {
                router.back();
              }}
            >
              取消
            </div>
          </FullWidth>
          <FullHeightAuto style={{ padding: '0 10px' }}>
            <p>热门搜索</p>

            <p>搜索历史</p>
            <div>
              {local.historyWords.map((word) => (
                <WordItem
                  key={word}
                  onClick={() => {
                    router.replaceView('SearchResult', { title: word });
                  }}
                >
                  {word}
                </WordItem>
              ))}
            </div>
          </FullHeightAuto>
        </UserAreaView>
      )}
    </Observer>
  );
}

export default {
  group: {
    view: 'Search',
  },
  View,
  model,
};
