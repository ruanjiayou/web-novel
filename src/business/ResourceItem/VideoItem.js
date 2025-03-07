import React, { Fragment } from 'react';
import { Observer } from 'mobx-react-lite';
import { useRouterContext } from 'contexts';
import timeFormat from 'utils/num2time';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import NoImage from 'theme/icon/image.svg';

export default function ({ item, display = 1, ...props }) {
  const router = useRouterContext();
  const onClick = props.onClick
    ? () => props.onClick(item)
    : () => {
      router.pushView('VideoInfo', { id: item._id });
    };
  return (
    <Observer>
      {() => {
        return (
          <Fragment>
            <div
              className={display === 3 ? 'full-height' : 'full-width'}
              style={{
                overflow: 'hidden',
                fontSize: '1rem',
                alignItems: 'flex-start',
              }}
              onClick={onClick}
            >
              <div
                style={{
                  width: '10rem',
                  height: '6rem',
                  flexShrink: 0,
                  backgroundImage: `url(${NoImage})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
                }}
              >
                {/* <img style={{ width: '100%', height: '100%', }} src={item.auto_cover} alt="" /> */}
                <LazyLoadImage
                  alt={''}
                  height={'100%'}
                  src={item.auto_cover}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <div
                className="full-width-auto full-height"
                style={{ padding: '0 5px', fontSize: '0.8rem' }}
              >
                <div>
                  <div
                    className="line2"
                    style={{
                      fontSize: '0.9rem',
                      wordBreak: 'break-all',
                      minHeight: '2.4rem',
                    }}
                  >
                    {item.title}
                  </div>
                </div>
                <div style={{ padding: '4px 0', color: 'rgb(146, 145, 145)' }}>
                  {display !== 3 && (
                    <Fragment>
                      {item.status === 4 ? '已更新' : '未就绪'} ·{' '}
                    </Fragment>
                  )}
                  {timeFormat(item.size || 0)}
                </div>
                {display !== 3 && item.desc && (
                  <div
                    style={{
                      color: 'rgb(146, 145, 145)',
                      wordBreak: 'break-all',
                    }}
                    className="line2"
                    dangerouslySetInnerHTML={{ __html: item.desc }}
                  ></div>
                )}
              </div>
            </div>
          </Fragment>
        );
      }}
    </Observer>
  );
}
