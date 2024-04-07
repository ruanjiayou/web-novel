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
  const containRef = useRef(null);
  useEffect(() => {
    if (containRef.current) {
      local.height = containRef.current.offsetHeight;
    }
  }, [containRef.current])
  useEffectOnce(() => {
    local.loader.refresh({ params: { source_type: 'video' } });
  });
  return (
    <Observer>
      {() => (
        <FullHeight
          style={{
            position: 'relative',
            backgroundImage: 'url(/logo.jpg)',
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
          <UserAreaView
            bgc="#00000052"
            bgcTop={'transparent'}
            bgcBot={'transparent'}
          >
            <div ref={ref => containRef.current = ref} style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', transform: `translate(0,${local.top}px)` }}>
              {local.loader.items.map((doc, i) => (
                <div key={doc.id} style={{ width: '100%', height: '100%', position: 'absolute', top: (i * local.height) + 'px' }}>
                  {doc.title}
                </div>
              ))}
            </div>
          </UserAreaView>
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
