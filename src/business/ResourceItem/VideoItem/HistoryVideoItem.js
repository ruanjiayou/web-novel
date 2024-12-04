import React, { Fragment } from 'react';
import { Observer } from 'mobx-react-lite';
import { useRouterContext } from 'contexts';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import NoImage from 'theme/icon/image.svg';
import { FaLaptop } from 'react-icons/fa';
import {
  IoMdPhonePortrait,
  IoMdTabletLandscape,
  IoMdWatch,
  IoIosTv,
  IoIosHelpCircleOutline,
} from 'react-icons/io';
import num2time from 'utils/num2time';
import format from 'date-fns/format';

const Icon = {
  smartphone: <IoMdPhonePortrait />,
  tablet: <IoMdTabletLandscape />,
  desktop: <FaLaptop />,
  wearable: <IoMdWatch />,
  tv: <IoIosTv />,
};
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
              className={'full-width'}
              style={{
                overflow: 'hidden',
                fontSize: '1rem',
                alignItems: 'stretch',
              }}
              onClick={onClick}
            >
              <div
                style={{
                  position: 'relative',
                  width: '10rem',
                  height: '6rem',
                  flexShrink: 0,
                  backgroundImage: `url(${NoImage})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
                }}
              >
                <LazyLoadImage
                  alt={''}
                  height={'100%'}
                  src={item.auto_cover}
                  style={{ width: '100%', height: '100%' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: 5,
                    bottom: 5,
                    fontSize: '0.6rem',
                    color: 'white',
                    backgroundColor: '#00000088',
                    padding: '3px 5px',
                    borderRadius: 3,
                  }}
                >
                  {num2time(props.watched)}/{num2time(item.size)}
                </div>
              </div>
              <div
                className="full-width-auto"
                style={{
                  padding: '0 5px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                }}
              >
                <div className="dd-common-alignside">
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
                <div style={{ display: 'flex' }}>
                  {Icon[props.device] || <IoIosHelpCircleOutline />} &nbsp;{' '}
                  {format(props.created_at, 'MM-DD HH:mm:SS')}
                </div>
              </div>
            </div>
          </Fragment>
        );
      }}
    </Observer>
  );
}
