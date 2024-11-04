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
      return item._id === music.currentId;
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
            }}
            {...props}
          >
            <CoverWrap>
              <Cover src={item.auto_cover} />
            </CoverWrap>
            <div
              style={{ flex: 1, color: local.isPlay ? '#33a3f4' : '' }}
              onClick={async (e) => {
                if (local.isPlay) return;
                const data = item.toJSON();
                e.preventDefault();
                e.stopPropagation();
                const old = await musicRecorder.getValue(data.id);
                if (!old) {
                  musicRecorder.setValue(data._id, data, { _id: '' });
                }
                music.loadHistory();
                music.play(data);
                if (router.lastView !== 'MusicPlayer') {
                  router.pushView('MusicPlayer', { id: data._id });
                } else {
                  router.replaceView('MusicPlayer', { id: data._id });
                }
              }}
            >
              {item.title}
            </div>
            <div className="dd-common-alignside">
              {/* TODO: MV */}
              {/* <VisualBoxView visible={mode === 'delete'}>
              <MIconView type="FaTrashAlt" onClick={async (e) => {
                e.preventDefault()
                e.stopPropagation()
                try {
                  await services.removeFromSheet({ params: { id: loader.item.id }, data: { list: [item._id] } })
                  loader.item.removeById(item.id)
                } catch (e) {

                }
              }} />
            </VisualBoxView> */}
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
                                  _id: item._id,
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
