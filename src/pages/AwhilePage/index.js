import React, { useEffect, useRef } from 'react';
import { useEffectOnce } from 'react-use';
import { Observer, useLocalStore } from 'mobx-react-lite';

import { MIconView, UserAreaView } from 'components';
import { FullHeight, AlignCenterXY } from 'components/common';
import createPageModel from 'page-group-loader-model/BasePageModel';
import showTip from 'utils/showTip';
import { RecommendResourceListLoader } from 'loader'
import Player from 'components/Player2';

const model = createPageModel({
  shorts: RecommendResourceListLoader
});

function View({ self, router, store, params }) {
  const local = useLocalStore(() => ({
    loader: RecommendResourceListLoader.create(),
    height: 100,
    top: 0,
  }));
  const lineLoader = store.lineLoader;
  const containRef = useRef(null);
  useEffect(() => {
    if (containRef.current) {
      const { height } = containRef.current.getBoundingClientRect();
      local.height = height;
      console.log(containRef.current, local.height)
    }
  }, [containRef])
  useEffectOnce(() => {
    local.loader.refresh({ params: { source_type: 'video' } });
  });
  return (
    <Observer>
      {() => (
        <FullHeight
          style={{
            position: 'relative',
            backgroundImage: 'url(/novel/logo.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: '50% 50%',
          }}
        >
          <AlignCenterXY
            style={{
              width: 40,
              height: 40,
              color: 'white',
              zIndex: 2,
              position: 'absolute',
              left: 'calc(10px + env(safe-area-inset-left))',
              top: 'calc(10px + env(safe-area-inset-top))',
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
            onClick={() => {
              router.replaceView(store.app.lastSelectMenu, {});
            }}
          >
            <MIconView type="FaChevronLeft" />
          </AlignCenterXY>
          <div ref={ref => containRef.current = ref} style={{
            position: 'absolute',
            left: 'env(safe-area-inset-left)',
            right: 'env(safe-area-inset-right)',
            top: 'env(safe-area-inset-top)',
            bottom: 'env(safe-area-inset-bottom)',
            overflow: 'hidden',
            height: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
            transform: `translate(0,${local.top}px)`,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
            {local.loader.items.map((doc, i) => (
              <div key={doc.id} style={{ width: '100%', height: '100%', position: 'absolute', top: (i * local.height) + 'px' }}>
                <div>{doc.title}</div>
              </div>
            ))}
          </div>
        </FullHeight>
      )}
    </Observer>
  );
}

export default {
  group: {
    view: 'awhile',
  },
  model,
  View,
};
