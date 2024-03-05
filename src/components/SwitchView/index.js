import React from 'react';
import { Observer } from 'mobx-react-lite';
import 'components/common.css';

export default function ({ children, holder, loading }) {
  return (
    <Observer>
      {() => {
        if (loading) {
          return holder;
        } else {
          return children;
        }
      }}
    </Observer>
  );
}
