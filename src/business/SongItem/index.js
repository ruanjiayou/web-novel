import React, { Fragment } from 'react';
import { Observer } from 'mobx-react-lite';
import CoverItem from './CoverItem';
import NormalItem from './Normaltem';
import PickerItem from './PickerItem';

export default function SongItem({ item, loader, type, ...props }) {
  return (
    <Observer>
      {() => {
        if (props.position === 'picker') {
          return <PickerItem item={item} loader={loader} {...props} />;
        }
        switch (type) {
          case 'cover':
            return <CoverItem item={item} loader={loader} {...props} />;
          default:
            return <NormalItem item={item} loader={loader} {...props} />;
        }
      }}
    </Observer>
  );
}
