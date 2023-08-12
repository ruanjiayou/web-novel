import React, { useEffect, Fragment, useRef, useCallback } from 'react'
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Tab, MenuWrap, MenuItem, TabItem, ContentWrap, Content, Slider } from './style'
import AlloyFinger from 'alloyfinger'
import event from '../../utils/events'

export default function ({ defaultIndex, tabs = [], children, onChange }) {
  const local = useLocalStore(() => ({
    selectedIndex: defaultIndex === -1 ? 0 : defaultIndex || 0,
    actionStarted: false,
    actionStartX: 0,
    actionOffsetX: 0,
    direction: '',
    left: 0,
    width: 36,
  }));
  const contentRef = useRef(null)
  const wrapRef = useRef(null)
  const resizeSlider = useCallback(() => {
    if (wrapRef.current) {
      const node = wrapRef.current.getElementsByTagName('div')[local.selectedIndex];
      local.left = node.offsetLeft + local.actionOffsetX;
      local.width = node.offsetWidth;
    }
  })
  useEffect(() => {
    if (contentRef.current) {
      const instance = new AlloyFinger(contentRef.current, {
        touchStart: (evt) => {
          if (local.actionStarted) return;
          local.actionStarted = true;
          local.actionStartX = evt.targetTouches[0].clientX;
          local.actionOffsetX = 0;
          local.direction = ''
        },
        touchEnd: (evt) => {
          local.actionStarted = false;
          local.actionStartX = 0;
          local.actionOffsetX = 0;
        },
        touchMove: function (evt) {
          if (!local.actionStarted) {
            return;
          }
          if (local.direction === '' && (evt.deltaX || evt.deltaY)) {
            local.direction = Math.abs(evt.deltaX) > Math.abs(evt.deltaY) ? 'h' : 'v';
          }
          if (local.direction === 'v') {
            // evt.preventDefault();
            // evt.stopPropagation();
            local.actionStarted = false;
            return;
          }
          local.actionOffsetX = evt.targetTouches[0].clientX - local.actionStartX;
        },
        swipe: (evt) => {
          evt.preventDefault()
          local.actionOffsetX = 0
          if (local.direction === 'h') {
            local.direction = '';
            if (evt.direction === 'Left') {
              if (local.selectedIndex < tabs.length - 1) {
                local.selectedIndex += 1;
              }
            } else if (evt.direction === 'Right') {
              if (local.selectedIndex > 0) {
                local.selectedIndex -= 1;
              }
            }
            resizeSlider();
          }
        }
      });
      event.on('swipeStart', () => {
        local.actionStarted = false;
      });
    }
  }, [contentRef.current])
  useEffect(() => {
    resizeSlider()
  }, [wrapRef.current])
  return <Observer>{() => (
    <Fragment>
      <Tab>
        <MenuWrap ref={ref => wrapRef.current = ref}>
          {tabs.map((tab, index) => <MenuItem key={index} selected={local.selectedIndex === index} onClick={() => {
            if (index === local.selectedIndex) {
              return;
            }
            local.selectedIndex = index;
            resizeSlider();
            onChange && onChange(tabs[index], index);
          }}>{tab.title}</MenuItem>)}
          <Slider left={local.left - local.actionOffsetX / 10} width={local.width} />
        </MenuWrap>
        <Content>
          <ContentWrap ref={ref => contentRef.current = ref} style={{ transform: `translateX(${contentRef.current ? -contentRef.current.offsetWidth * local.selectedIndex + (local.direction === 'h' ? local.actionOffsetX : 0) / 2 + 'px' : (local.selectedIndex * 100) + '%'})` }} selectedIndex={local.selectedIndex}>
            {children.map((child, index) => <TabItem key={index}>{child}</TabItem>)}
          </ContentWrap>
        </Content>
      </Tab>
    </Fragment>
  )}</Observer>
}