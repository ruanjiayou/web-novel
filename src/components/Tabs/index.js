import React, { useEffect, Fragment, useRef } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Tab, MenuWrap, MenuItem, TabItem, ContentWrap, Content } from './style'
import AlloyFinger from 'alloyfinger'

export default function ({ defaultIndex, tabs = [], children, onChange }) {
  const local = useLocalStore(() => ({
    selectedIndex: defaultIndex || 0,
    actionStarted: false,
    actionStartX: 0,
    actionOffsetX: 0,
  }));
  const contentRef = useRef(null)
  useEffect(() => {
    if (contentRef.current) {
      new AlloyFinger(contentRef.current, {
        touchStart: (evt) => {
          if (local.actionStarted) return;
          local.actionStarted = true;
          local.actionStartX = evt.targetTouches[0].clientX;
          local.actionOffsetX = 0;
        },
        touchEnd: (evt) => {
          local.actionStarted = false;
          local.actionStartX = 0;
          local.actionOffsetX = 0;
        },
        touchMove: (evt) => {
          local.actionOffsetX = evt.targetTouches[0].clientX - local.actionStartX;
        },
        swipe: (evt) => {
          if (evt.direction === 'Left') {
            if (local.selectedIndex < tabs.length - 1) {
              local.selectedIndex += 1;
            }
          } else if (evt.direction === 'Right') {
            if (local.selectedIndex > 0) {
              local.selectedIndex -= 1;
            }
          }
        }
      });
    }
  }, [contentRef.current])
  return <Observer>{() => (
    <Fragment>
      <Tab>
        <MenuWrap>
          {tabs.map((tab, index) => <MenuItem key={tab.key} selected={local.selectedIndex === index} onClick={() => {
            if (index === local.selectedIndex) {
              return;
            }
            local.selectedIndex = index;
            onChange && onChange(index);
          }}>{tab.title}</MenuItem>)}
        </MenuWrap>
        <Content>
          <ContentWrap ref={ref => contentRef.current = ref} style={{ transform: `translateX(${contentRef.current ? -contentRef.current.offsetWidth * local.selectedIndex + local.actionOffsetX / 2 + 'px' : (local.selectedIndex * 100) + '%'})` }} selectedIndex={local.selectedIndex}>
            {children.map((child, index) => <TabItem key={index}>{child}</TabItem>)}
          </ContentWrap>
        </Content>
        <div>{contentRef.current ? -contentRef.current.offsetWidth * local.selectedIndex + local.actionOffsetX / 2 + 'px' : (local.selectedIndex * 100) + '%'}</div>
        <div>{local.actionOffsetX / 2}</div>
      </Tab>
    </Fragment>
  )}</Observer>
}