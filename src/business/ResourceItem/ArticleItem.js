import React, { Fragment } from 'react';
import { Observer } from 'mobx-react-lite';
import { useRouterContext } from 'contexts';
// import config from 'config'
import timespan from 'utils/timespan';
import dd from 'date-fns';

export default function ({ item }) {
  const router = useRouterContext();
  return (
    <Observer>
      {() => {
        return (
          <Fragment>
            <div
              className="full-width"
              onClick={() => {
                router.pushView(item.type === 'image' ? 'Image' : 'Article', {
                  id: item.id,
                });
              }}
            >
              <div
                className="full-width-fix"
                style={{
                  width: 60,
                  height: 80,
                  backgroundColor: '#0094fd',
                  marginRight: 20,
                }}
              >
                <img
                  style={{ width: '100%', height: '100%' }}
                  src={item.auto_cover}
                  alt=""
                />
              </div>
              <div className="full-width-auto full-height">
                <div className="line2" style={{ fontSize: '1.2rem' }}>
                  {item.title}
                </div>
                <div
                  style={{ padding: '4px 0', color: 'rgb(146, 145, 145)' }}
                ></div>
                <div style={{ color: 'rgb(146, 145, 145)' }}>
                  {timespan(new Date(item.createdAt), 'YYYY-MM-DD HH:mm:ss')}
                </div>
              </div>
            </div>
          </Fragment>
        );
      }}
    </Observer>
  );
}
