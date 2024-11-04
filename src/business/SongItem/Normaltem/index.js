import React, { Fragment } from 'react';
import { Observer } from 'mobx-react-lite';
import { MIconView, VisualBoxView } from 'components';
import { useStoreContext } from 'contexts/store';
import { useRouterContext } from 'contexts';
import services from 'services';
import Recorder from 'utils/cache';
import styled from 'styled-components';

const musicRecorder = new Recorder('music');
const Wrap = styled.div`
  background-color: ${(prop => prop.isPlay ? '#eaf1f7' : '')};
  color: ${(prop => prop.isPlay ? '#33a3f4' : '')};
  border-bottom: 1px solid #eee;
  border-left: 2px solid ${prop => prop.isPlay ? '#0094fd' : 'transparent'};
  padding: 5px 0 5px 5px;
`

export default function ({ item, mode = 'add', loader, ...props }) {
  const router = useRouterContext();
  const store = useStoreContext();
  const music = store.music;
  return (
    <Observer>
      {() => (
        <Fragment>
          <Wrap
            isPlay={item._id === music.currentId}
            className="dd-common-alignside"
            // {...props}
          >
            <div
              style={{
                flex: 1,
              }}
              onClick={async (e) => {
                if (music.currentId === item._id) return;
                const data = item.toJSON();
                e.preventDefault();
                e.stopPropagation();
                const old = await musicRecorder.getValue(data._id);
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
                        params: { id: loader.item.id },
                        data: { list: [item._id] },
                      });
                      loader.item.removeById(item._id);
                    } catch (e) { }
                  }}
                />
              </VisualBoxView>
            </div>
          </Wrap>
        </Fragment>
      )}
    </Observer>
  );
}
