import React, { Fragment, useEffect, useRef } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { ActivityIndicator, Progress } from 'antd-mobile';

import createPageModel from 'page-group-loader-model/BasePageModel';
import {
  EmptyView,
  AutoCenterView,
  VisualBoxView,
  MIconView,
} from 'components';

const model = createPageModel({});

function View({ self, router }) {
  return (
    <Observer>
      {() => {
        return (
          <Fragment>
            <div className="dd-common-centerXY">404:页面不存在</div>
          </Fragment>
        );
      }}
    </Observer>
  );
}

export default {
  model,
  View,
  group: {
    view: '404',
    attrs: {},
  },
};
