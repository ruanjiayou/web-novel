import React, { Fragment } from 'react';
import { Tabs } from 'antd-mobile';
import TabPane from '../TabPane';

export default function Tab({ self, children, ...props }) {
  return (
    <Fragment>
      <Tabs
        tabs={self.children.map((ch, index) => ({
          title: ch.title,
          sub: index,
        }))}
      >
        {self.children.map((child, index) => (
          <TabPane key={index} self={child} {...props} />
        ))}
      </Tabs>
    </Fragment>
  );
}
