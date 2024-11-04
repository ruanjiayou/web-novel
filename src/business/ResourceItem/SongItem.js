import React, { Fragment } from 'react';
import { Observer } from 'mobx-react-lite';
import { ActionSheet } from 'antd-mobile';
import { MIconView, VisualBoxView } from 'components';
import { useStoreContext } from 'contexts/store';
import { useRouterContext } from 'contexts';
import services from 'services';
import Recorder from 'utils/cache';

const musicRecorder = new Recorder('music');

export default function ({ item, mode = 'add', loader, ...props }) {
  const router = useRouterContext();
  const store = useStoreContext();
  const music = store.music;
  return (
    <Observer>
      {() => (
        <Fragment>
          <div
            className="dd-common-alignside"
            style={{
              backgroundColor: item._id === music.currentId ? 'grey' : '',
              borderBottom: '1px solid #eee',
            }}
            {...props}
          >
            <MIconView
              type={music.currentId === item._id ? 'FaPause' : 'FaPlay'}
            />
            <div
              style={{ flex: 1 }}
              onClick={async (e) => {
                if (music.currentId === item._id) return;
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
              <VisualBoxView visible={mode === 'delete'}>
                <MIconView
                  type="FaTrashAlt"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                      await services.removeFromSheet({
                        params: { _id: loader.item.id },
                        data: { list: [item._id] },
                      });
                      loader.item.removeById(item._id);
                    } catch (e) {}
                  }}
                />
              </VisualBoxView>
              <VisualBoxView visible={mode === 'add'}>
                <MIconView
                  type="FaPlus"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
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
