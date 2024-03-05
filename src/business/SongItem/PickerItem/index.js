import React, { Fragment } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { ActionSheet } from 'antd-mobile';
import { MIconView, VisualBoxView } from 'components';
import { useStoreContext } from 'contexts/store';
import { useRouterContext } from 'contexts';
import services from 'services';
import Recorder from 'utils/cache';
import { Cover, CoverWrap } from './style';
import showTip from 'utils/showTip';

const musicRecorder = new Recorder('music');

export default function ({ item, more, loader, ...props }) {
  const router = useRouterContext();
  const store = useStoreContext();
  const music = store.music;
  const local = useLocalStore(() => ({
    docked: false,
    onDock() {
      local.docked = !local.docked;
    },
    get isPlay() {
      return item.id === music.currentId;
    },
  }));
  return (
    <Observer>
      {() => (
        <Fragment>
          <div
            className="dd-common-alignside"
            style={{
              backgroundColor: local.isPlay ? '#eaf1f7' : '',
              borderBottom: '1px solid #eee',
              borderLeft: local.isPlay ? '2px solid #0094fd' : 'none',
              alignItems: 'stretch',
            }}
            {...props}
          >
            <CoverWrap>
              <Cover src={item.auto_cover} />
            </CoverWrap>
            <div
              style={{
                flex: 1,
                padding: '0 10px',
                color: local.isPlay ? '#33a3f4' : '',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
              }}
              onClick={async (e) => {
                if (local.isPlay) return;
                const data = item.toJSON();
                e.preventDefault();
                e.stopPropagation();
                const old = await musicRecorder.getValue(data.id);
                if (!old) {
                  musicRecorder.setValue(data.id, data, { id: '' });
                }
                music.loadHistory();
                music.play(data);
                if (router.lastView !== 'MusicPlayer') {
                  router.pushView('MusicPlayer', { id: data.id });
                } else {
                  router.replaceView('MusicPlayer', { id: data.id });
                }
              }}
            >
              <div>{item.title}</div>
            </div>
            <div className="dd-common-alignside">
              <VisualBoxView visible={more}>
                <MIconView
                  type="FaEllipsisH"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!store.app.isLogin) {
                      return showTip(router);
                    }
                    const result = await services.getSheets({
                      query: { type: 'song' },
                    });
                    const list = result.items.map((it) => it.title);
                    ActionSheet.showActionSheetWithOptions(
                      {
                        options: [...list, '取消'],
                        message: '添加到歌单',
                        maskClosable: true,
                        cancelButtonIndex: list.length - 1,
                      },
                      (index) => {
                        if (index <= list.length - 1 && index >= 0) {
                          services.addToSheet({
                            params: result.items[index],
                            data: {
                              list: [
                                {
                                  title: item.title,
                                  poster: item.poster,
                                  id: item.id,
                                  url: item.url,
                                },
                              ],
                            },
                          });
                        }
                      },
                    );
                  }}
                />
              </VisualBoxView>
            </div>
          </div>
        </Fragment>
      )}
    </Observer>
  );
}
