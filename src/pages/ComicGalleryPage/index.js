import React, { useEffect } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { useEffectOnce } from 'react-use';

import { GalleryLoader } from 'loader';
import { AutoCenterView, EmptyView, UserAreaView } from 'components';
import { FullHeight, FullHeightAuto, FullHeightFix } from 'components/common';
import createPageModel from 'page-group-loader-model/BasePageModel';

const model = createPageModel({
  GalleryLoader,
});

function View({ self, store, router, params, Navi }) {
  let imageHost = store.lineLoader.getHostByType('image');
  useEffect(() => {
    if (params.id) {
      self.GalleryLoader.refresh({ params: { _id: params.id, mid: params.mid } });
    }
    return () => {
      self.GalleryLoader.clear();
    };
  }, [params.id]);
  return (
    <Observer>
      {() => {
        const blank = EmptyView(self.GalleryLoader);
        if (blank) {
          return blank;
        }
        return (
          <UserAreaView bgcTop={'black'} bgcBot={'black'}>
            <Navi
              title={self.GalleryLoader.item.title}
              router={router}
              wrapStyle={{ backgroundColor: 'black' }}
            />
            <FullHeightAuto style={{ fontSize: 0 }}>
              {self.GalleryLoader.item.images.map((image) => (
                <img
                  src={imageHost + image}
                  key={image}
                  style={{ width: '100%' }}
                />
              ))}
            </FullHeightAuto>
            <FullHeightFix>
              {self.GalleryLoader.item.next && (
                <div
                  style={{ textAlign: 'center', padding: '6px 0' }}
                  onClick={() => {
                    router.replaceView('ComicGallery', {
                      mid: self.GalleryLoader.item.next.mid,
                      id: self.GalleryLoader.item.next._id,
                    });
                  }}
                >
                  {self.GalleryLoader.item.next.title}
                </div>
              )}
            </FullHeightFix>
          </UserAreaView>
        );
      }}
    </Observer>
  );
}

export default {
  group: {
    view: 'ComicGallery',
  },
  View,
  model,
};
