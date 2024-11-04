import React, { Fragment } from 'react';
import { Observer } from 'mobx-react-lite';
import { useRouterContext } from 'contexts';

export default function ({ item }) {
  const router = useRouterContext();
  return (
    <Observer>
      {() => {
        return (
          <Fragment>
            <div
              className="full-width"
              style={{ margin: 10 }}
              onClick={() => {
                router.pushView(`BookInfo`, { id: item._id });
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
                <div className="dd-common-alignside">
                  <div style={{ fontSize: '1.2rem' }}>{item.title}</div>
                </div>
                <div style={{ padding: '4px 0', color: 'rgb(146, 145, 145)' }}>
                  {item.uname} · {item.status === 'loading' ? '连载' : '完结'} ·{' '}
                  {Math.round(item.words / 10000)}万字
                </div>
                <div
                  style={{ color: 'rgb(146, 145, 145)' }}
                  className="line2"
                  dangerouslySetInnerHTML={{ __html: item.desc }}
                ></div>
              </div>
            </div>
          </Fragment>
        );
      }}
    </Observer>
  );
}
