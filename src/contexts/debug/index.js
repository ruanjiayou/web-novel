import React, { useContext as useReactContext } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import store from '../../store';
import storage from 'utils/storage';
import { MIconView, Dragger, VisualBoxView } from 'components';

// 上下文context.避免react多级一直传props
const Context = React.createContext(null);

function Debug(prop) {
  const debug = store.debug;
  const pos = storage.getValue('debug');
  const debugStore = useLocalStore(() => ({
    top: pos ? pos.top : 300,
    left: pos ? pos.left : 0,
  }));
  let timer = null;
  return (
    <Observer>
      {() => (
        <VisualBoxView visible={store.app.showDebug}>
          <div
            className="full-height"
            style={{
              position: 'fixed',
              color: 'white',
              zIndex: 10,
              width: 300,
              height: 150,
              top: debugStore.top,
              left: debugStore.left,
              padding: 10,
              backgroundColor: 'black',
              opacity: 0.5,
            }}
          >
            <div className="dd-common-alignside">
              <Dragger
                cb={(sstore) => {
                  debugStore.left = Math.max(
                    0,
                    sstore.left + sstore.offsetLeft,
                  );
                  debugStore.top = Math.max(0, sstore.top + sstore.offsetTop);
                  clearTimeout(timer);
                  timer = null;
                  timer = setTimeout(() => {
                    storage.setValue('debug', {
                      left: debugStore.left,
                      top: debugStore.top,
                    });
                  }, 100);
                }}
              >
                <MIconView type="FaArrowsAlt" />
              </Dragger>
              <MIconView
                type={debug.showMap ? 'FaCaretDown' : 'FaCaretRight'}
                onClick={() => {
                  debug.toggleMap();
                }}
              />
              <div className="dd-common-alignside">
                <MIconView
                  type="FaRegTrashAlt"
                  onClick={() => {
                    debug.clear();
                  }}
                />
                <MIconView
                  type="FaSyncAlt"
                  onClick={() => {
                    window.location.reload();
                  }}
                />
              </div>
            </div>
            <VisualBoxView visible={debug.showMap}>
              <div className="full-height-auto">
                {debug.maps.map((item, index) => (
                  <p key={index}>
                    {item.key}:{item.value}
                  </p>
                ))}
              </div>
            </VisualBoxView>
            <div className="full-height-auto">
              {debug.messages.map((message, index) => (
                <p key={index}>{message}</p>
              ))}
            </div>
          </div>
        </VisualBoxView>
      )}
    </Observer>
  );
}

export function createDebugProvider() {
  return [Debug, Context];
}

export function useDebugContext() {
  return useReactContext(Context);
}
