import React, { Fragment } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import timespan from 'utils/timespan';
import { useRouterContext } from 'contexts';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import styled from 'styled-components';

const Wrap = styled.div`
  margin: 10px -10px;
  background-color: white;
  padding: 10px;
  overflow: hidden;
`
const Item = styled.div`
  width: 30%;
  margin-left: 1%;
  padding-top: 33%;
  position: relative;
  overflow: hidden;
`
const VideoItem = styled.div`

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
              <div style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                {item.images && item.images.map((image, index) => (<Item key={index}>
                  <LazyLoadImage src={local.imageHost + image.path} style={{ width: '100%', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
                </Item>))}
                {item.videos && item.videos.map((video, index) => (<Item key={index}>
                  <video src={local.videoHost + video.path} controls style={{ width: '100%', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
                </Item>))}
              </div>
            </Wrap>
          </Fragment>
        );
      }}
    </Observer>
  );
}
