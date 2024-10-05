import React, { Fragment } from 'react';
import { Observer } from 'mobx-react-lite';
import timespan from 'utils/timespan';
import { useRouterContext } from 'contexts';

export default function ({ item }) {
  const router = useRouterContext();
  return (
    <Observer>
      {() => {
        return (
          <Fragment>
            <div
              style={{
                margin: '0 10px',
                padding: '10px  0 5px 0',
                borderBottom: '1px solid #eee',
              }}
              onClick={() => {
                router.pushView('Post', { id: item.id });
              }}
            >
              <div style={{ fontSize: '1.2rem' }}>{item.content || item.title}</div>
              <div style={{ color: 'grey', padding: '5px 0' }}>
                {timespan(new Date(item.createdAt))}
              </div>
            </div>
          </Fragment>
        );
      }}
    </Observer>
  );
}
