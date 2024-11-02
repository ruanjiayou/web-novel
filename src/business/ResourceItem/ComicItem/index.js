import React, { Fragment } from 'react';
import { Observer } from 'mobx-react-lite';
import { useRouterContext } from 'contexts';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import NoImage from 'theme/icon/image-v.svg';

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
                router.pushView('ComicInfo', { id: item.id });
              }}
            >
              <div
                className="full-width-fix"
                style={{
                  width: 60,
                  height: 80,
                  flexShrink: 0,
                  marginRight: 20,
                  backgroundImage: `url(${NoImage})`,
                  backgroundPosition: 'center center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* <img style={{ width: '100%', height: '100%' }} src={item.auto_cover} alt="" /> */}
                <LazyLoadImage
                  alt={''}
                  height={'100%'}
                  src={item.auto_cover}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <div className="full-width-auto full-height">
                <div className="dd-common-alignside">
                  <div
                    className="line2"
                    style={{ fontSize: '1rem', wordBreak: 'break-all' }}
                  >
                    {item.title}
                  </div>
                </div>
                <div style={{ padding: '4px 0', color: 'rgb(146, 145, 145)' }}>
                  {item.status === 'loading' ? '连载' : '完结'} ·{' '}
                  {item.counter.chapters}话
                </div>
                <div
                  style={{
                    color: 'rgb(146, 145, 145)',
                    wordBreak: 'break-all',
                    fontSize: '0.8rem',
                  }}
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
