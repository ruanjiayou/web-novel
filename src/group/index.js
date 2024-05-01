import React, { useEffect } from 'react';
import { useMount } from 'react-use';
import { Observer } from 'mobx-react-lite';
import renderEmptyView from 'components/EmptyView';
import AutoCenterView from 'components/AutoCenterView';
import Filter from './Filter';
import FilterRow from './FitlerRow';
import FilterTag from './FilterTag';
import Picker from './Picker';
import TreeNode from './TreeNode';
import Tab from './Tab';
import TabPane from './TabPane';
import Random from './Random';
import { PullToRefresh } from 'antd-mobile';
import store from '../store'

const views = {
  filter: Filter,
  'filter-tag': FilterTag,
  'filter-row': FilterRow,
  picker: Picker,
  random: Random,
  tab: Tab,
  'tab-pane': TabPane,
  'tree-node': TreeNode,
  view(name) {
    if (this[name]) {
      return this[name];
    }
  },
};

function isInViewPort(el) {
  if (!el) {
    return false;
  }
  const viewPortHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  const top = el.getBoundingClientRect() && el.getBoundingClientRect().top;
  return top <= viewPortHeight - 10;
}

export function AutoView({ self, ...props }) {
  return (
    <Observer>
      {() => {
        if (self === null) {
          return <div>null</div>;
        }
        if (self.parent_id === '') {
          return self.children.map((child) => (
            <AutoView key={child.id} self={child} {...props} />
          ));
        } else {
          let View = views.view(self.view);
          if (View) {
            return <View self={self} {...props} />;
          } else {
            return <div>?</div>;
          }
        }
      }}
    </Observer>
  );
}
export function RenderGroups({ loader, group, params, ...props }) {
  const emptyView = renderEmptyView(loader);
  useMount((mount) => {
    mount && mount();
  }, []);
  useEffect(() => {
    if (loader.state === 'init' && group.id === store.app.tab) {
      loader.refresh({ params: { name: group.name } });
    }
  }, [store.app.tab])
  return (
    <Observer>
      {() => {
        if (loader.isEmpty) {
          return <AutoCenterView>{emptyView}</AutoCenterView>;
        } else {
          // overflow: auto 影响tabs
          return (
            <div style={{ height: '100%', overflow: 'auto' }}>
              {loader.item.attrs.allowRefresh ? (
                <PullToRefresh
                  distanceToRefresh={60}
                  damping={500}
                  style={{ height: '100%', overflow: 'auto' }}
                  onRefresh={() =>
                    loader.refresh({ params: { name: group.name } })
                  }
                >
                  <AutoView self={loader.item} loader={loader} {...props} />
                </PullToRefresh>
              ) : (
                <AutoView self={loader.item} loader={loader} {...props} />
              )}
            </div>
          );
        }
      }}
    </Observer>
  );
}
