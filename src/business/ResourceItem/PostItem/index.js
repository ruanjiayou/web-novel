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
  width: 50%;
  margin-left: 1%;
  padding-top: 30%;
  position: relative;
  overflow: hidden;
`
const VideoItem = styled.div`

`
const PlayBtn = styled.div`
  position: absolute;
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
                // router.pushView('Post', { id: item._id });
              }}
            >
              <div style={{ color: 'grey', padding: '5px 0' }}>
                {item.uname} {timespan(new Date(item.createdAt))}
              </div>
              <div style={{ fontSize: '1.2rem' }}>{item.content || item.title}</div>
              <div style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                {item.images && item.images.map((image, index) => (<Item key={index}>
                  <LazyLoadImage src={local.imageHost + image.path} className='center-xy' style={{ width: '100%', }} />
                </Item>))}
                {item.videos && item.videos.map((video, index) => (<Observer key={index}>{() => (
                  <Item>
                    <LazyLoadComponent>
                      <video src={local.videoHost + video.path} controls={false} className='center-xy' style={{ width: '100%', backgroundColor: 'black' }} onEnded={() => { video.pause() }} />
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
                    >{!video.is_playing ? <PlayIcon style={{ width: 45, height: 45 }} /> : <PauseIcon style={{ width: 45, height: 45 }} />}</PlayBtn>
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
