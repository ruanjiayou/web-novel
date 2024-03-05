import React, { useCallback, useEffect, useState, useRef } from 'react';
import { cloneDeep } from 'lodash';
import PinchZoom from '../PinchZoom';
import { Observer, useLocalStore } from 'mobx-react-lite';

export default ({
  items,
  onChangeIndex,
  activeIndex = 0,
  onDoubleTap,
  onGestureEnd,
  children,
}) => {
  const startX = useRef(0),
    startY = useRef(0);
  const distanceX = useRef(0);
  const local = useLocalStore(() => ({
    isDragging: false,
    isZooming: false,
    status: 'init',
    direaction: '',
    index: 0,
    dataIndex: 0,
    lastIndex: 0,
    lastDataIndex: 0,
    firstMove: false,
    firstLoad: false,
    vx: 0,
    lastX: 0,
    data: [],
    visibleData: [],
  }));
  const container = useRef(null);
  const orientationTimer = useRef(null);
  const root = useRef(null);
  const updateVisibleData = (lastIndex, latestIndex, data) => {
    // TODO:
    const initData = data[latestIndex];
    data[lastIndex]._show = false;
    let initIndex = latestIndex;
    let _offsetX = -(initIndex * window.innerWidth);
    local.visibleData = data;
    container.current.style.setProperty(
      'transform',
      `translateX(${_offsetX}px)`,
    );
    local.lastDataIndex = latestIndex;
  };
  useEffect(() => {
    const onChange = () => {
      clearTimeout(orientationTimer.current);
      orientationTimer.current = setTimeout(() => {
        let _offsetX, viewSize;
        switch (window.orientation) {
          case 90:
          case -90:
            viewSize = Math.max(window.innerWidth, window.innerHeight);
            _offsetX = -(index * viewSize);
            if (container.current) {
              container.current.style.setProperty(
                'transform',
                `translateX(${_offsetX}px)`,
              );
            }
        }
      }, 500);
    };
    window.addEventListener('orientationchange', onChange);
    return function removeListener() {
      window.removeEventListener('orientationchange', onChange);
    };
  }, [local.index]);
  useEffect(() => {
    let _data = items.map((item, i) => {
      return {
        data: item,
        _isTaken: false,
        _index: i,
        _show: false,
      };
    });
    local.data = _data;
    if (activeIndex === 0 && local.lastDataIndex === 0) {
      updateVisibleData(local.lastDataIndex, activeIndex, local.data);
    }
    local.firstLoad = true;
  }, [items]);
  useEffect(() => {
    if (activeIndex !== local.lastDataIndex) {
      updateVisibleData(local.lastDataIndex, local.dataIndex, local.data);
    }
  }, [activeIndex]);
  useEffect(() => {
    if (local.firstLoad) {
      local.firstLoad = false;
      return;
    }
    if (local.lastDataIndex !== local.dataIndex) {
      updateVisibleData(local.lastDataIndex, local.dataIndex, local.data);
    }
  }, [local.dataIndex]);
  const touchStart = useCallback((e) => {
    let numPoints = e.touches.length;
    if (numPoints === 1) {
      local.firstMove = true;
      local.vx = 0;
      startX.current = e.touches[0].pageX;
      startY.current = e.touches[0].pageY;
      local.status = 'start';
    }
  });
  const touchMove = useCallback(
    (e) => {
      let touches = e.touches;
      if (touches.length === 1) {
        if (local.firstMove) {
          const touch = touches[0];
          const dx = Math.abs(touch.pageX - startX.current);
          const dy = Math.abs(touch.pageY - startY.current);
          const isSwiping = dx > dy && dx > 10;
          e.preventDefault();
          if (isSwiping) {
            startX.current = touch.pageX;
            local.firstMove = false;
          } else {
            local.vx = local.vx * 0.5 + (touch.pageX - local.lastX) * 0.5;
            local.lastX = touch.pageX;
            let diff = touch.pageX - startX.current;
            let offset = -local.index * window.innerWidth + diff;
            container.current.style.setProperty(
              'transform',
              `translateX(${offset}px)`,
            );
            distanceX.current = diff;
          }
        }
      }
    },
    [index],
  );
  const touchEnd = useCallback(
    (e) => {
      let _index = local.index;
      if (Math.abs(local.vx) > 5) {
        if (local.vx > 0) {
          _index--;
        } else {
          _index++;
        }
      } else if (Math.abs(distanceX.current) > window.innerWidth / 3) {
        if (distanceX.current > 0) {
          local.direaction = 'right';
          _index--;
        } else {
          local.direaction = 'left';
          _index++;
        }
      }
      if (_index < 0) {
        _index = 0;
      }
      if (_index > local.visibleData.length - 1) {
        _index = local.visibleData.length - 1;
      }
      local.lastIndex = local.index;
      local.index = _index;
      container.current.style.setProperty(
        'transform',
        `translateX(${-(_index * window.innerWidth)}px)`,
      );
      distanceX.current = 0;
      local.isDragging = false;
      local.isZooming = false;
    },
    [local.index, local.visibleData],
  );
  const transitionEnd = useCallback(
    (e) => {
      let currentData = local.visibleData[local.index];
      let _dataIndex = local.data.findIndex(
        (item) => item.id === currentData.id,
      );
      local.status = 'end';
      local.dataIndex = _dataIndex;
      if (_dataIndex !== local.lastDataIndex) {
        if (onChangeIndex) {
          onChangeIndex(index, 'swipe');
        }
      }
    },
    [local.index, local.visibleData],
  );
  useEffect(() => {
    if (root.current) {
      root.current.addEventListener('touchmove', touchMove);
    }
    return () => {
      root.current.removeEventListener('touchmove', touchMove);
    };
  }, [touchMove]);
  const renderItem = (item, index) => {
    let image = item.data;
    return (
      <PinchZoom
        style={{ height: '100%' }}
        key={index}
        onGestureEnd={onGestureEnd}
        onDoubleTap={onDoubleTap}
      >
        <img src={image.path} />
      </PinchZoom>
    );
  };
  return (
    <Observer>
      {() => (
        <div
          ref={root}
          onTransitionEnd={transitionEnd}
          onTouchEnd={touchEnd}
          onTouchStart={touchStart}
          onClick={() => {
            if (local.fullscreen === false) {
              local.fullscreen = true;
            }
          }}
          style={{
            width: '100%',
            height: '100%',
            position: local.fullscreen ? 'fixed' : 'static',
            left: 0,
            top: 0,
            zIndex: 2,
            overflow: 'hidden',
          }}
        >
          <div
            ref={container}
            style={{
              transition:
                local.status !== 'end' && local.status !== 'init'
                  ? 'transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s'
                  : 'none',
              display: 'flex',
              flex: 1,
              width: '100%',
              height: '100%',
            }}
          >
            {local.visibleData.map((item, _index) => {
              return (
                <div
                  data-id={item.id}
                  key={item._index}
                  style={{ width: '100%', flexShrink: 0 }}
                >
                  {renderItem(item, _index)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Observer>
  );
};
