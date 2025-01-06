import React, { Fragment } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import timespan from 'utils/timespan';
import { useRouterContext } from 'contexts';
import { LazyLoadImage, LazyLoadComponent } from 'react-lazy-load-image-component';
import styled from 'styled-components';
import { ReactComponent as PlayIcon } from 'theme/icon/play-fill.svg'
import { ReactComponent as PauseIcon } from 'theme/icon/pause.svg'

const Wrap = styled.div`
  margin: 10px -10px;
  background-color: white;
  padding: 10px;
  overflow: hidden;
`
const Item = styled.div`
  width: 40%;
  font-size: 0;
  margin-right: 1%;
  padding-top: 40%;
  position: relative;
  overflow: hidden;
  background-color: #a1a1a11a;
  flex: 0 0 auto;
`
const VideoItem = styled.div`

`
const ImageItem = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
`
const PlayBtn = styled.div`
  z-index: 2;
`

export default function ({ item }) {
  const local = useLocalStore(() => ({
    imageHost: store.lineLoader.getHostByType('image'),
    videoHost: store.lineLoader.getHostByType('video'),
  }))
  const router = useRouterContext();
  return (
    <Observer>
      {() => {
        return (
          <Fragment>
            <Wrap
              onClick={() => {
                router.pushView('Post', { id: item._id });
              }}
            >
              <div style={{ color: 'grey', padding: '5px 0' }}>
                {item.uname} {timespan(new Date(item.createdAt))}
              </div>
              <div style={{ fontSize: '1.2rem' }}>{item.content || item.title}</div>
              <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', marginTop: 10, overflow: 'hidden' }}>
                {item.images && item.images.map((image, index) => (<Item key={index}>
                  <LazyLoadComponent>
                    <ImageItem src={local.imageHost + image.path} style={{ width: image.more.height > image.more.width ? '100%' : 'auto', height: image.more.height > image.more.width ? 'auto' : '100%' }} />
                  </LazyLoadComponent>
                </Item>))}
                {item.videos && item.videos.map((video, index) => (<Observer key={index}>{() => (
                  <Item>
                    <LazyLoadComponent>
                      <video src={local.videoHost + video.path} preload='metadata' controls={false} playsInline muted className='center-xy' style={{ zIndex: 2, width: video.more.height > video.more.width ? '100%' : 'auto', height: video.more.height > video.more.width ? 'auto' : '100%' }} onEnded={() => { video.pause() }} />
                    </LazyLoadComponent>
                    <PlayBtn className='center-xy'
                      onClick={e => {
                        const vs = e.currentTarget.parentElement.getElementsByTagName('video')[0];
                        if (video.is_playing) {
                          vs.pause();
                          video.pause();
                        } else {
                          vs.play();
                          video.play();
                        }
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >{video.is_playing ? <PauseIcon style={{ width: 45, height: 45 }} /> : <PlayIcon style={{ width: 45, height: 45 }} />}</PlayBtn>
                  </Item>
                )}</Observer>))}
              </div>
            </Wrap>
          </Fragment>
        );
      }}
    </Observer>
  );
}
