import React, { useCallback, useEffect, useRef } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';

// 获取中心点坐标
const getTouchCenter = (touches) => {
  return {
    x: touches.map(({ x }) => x).reduce((a, b) => a + b, 0) / touches.length,
    y: touches.map(({ y }) => y).reduce((a, b) => a + b, 0) / touches.length,
  };
};

// 获取两点间的直线距离
const getDistance = (a, b) => {
  let x = a.x - b.x;
  let y = a.y - b.y;
  return Math.sqrt(x * x, y * y);
};

// 根据触摸点计算缩放倍数
const calculateScale = (startTouches, endTouches, scale) => {
  // 缩放出现长度只有1
  if (endTouches.length < 2) {
    return 0;
  }
  const startDistance = getDistance(startTouches[0], startTouches[1]);
  const endDistance = getDistance(endTouches[0], endTouches[1]);
  const dscale = endDistance / startDistance;
  const truescalue = dscale * scale;
  return truescalue > 2 ? 2 / scale : truescalue < 0.5 ? 0.5 / scale : dscale;
};

const swing = (p) => {
  return -Math.cos(p * Math.PI) / 2 + 0.5;
};
// TODO: limit x,y into box
export default ({
  wrapStyle,
  src,
  style,
  visible,
  onTap,
  onUpdate,
  onDoubleTap,
  onDragStart,
  onDragEnd,
}) => {
  const local = useLocalStore(() => ({
    box: { width: 0, height: 0 },
    // 实际缩放系数 = base_scale * curr_scale * incr_scale
    // 初始化时小图不变(base_scale=最大化显示的倍数,curr_scale=1/base_scale)大图缩小(base_scale=1/radio,curr_scale=1)
    // 实际缩放系数:
    base_scale: 1,
    curr_scale: 1,
    incr_scale: 1,
    // 根据触摸点计算缩放倍数
    calc_incr_scale: (startTouches, endTouches) => {
      // 缩放出现长度只有1
      if (endTouches.length < 2) {
        return local.incr_scale;
      }
      const startDistance = getDistance(startTouches[0], startTouches[1]);
      const endDistance = getDistance(endTouches[0], endTouches[1]);
      const diff = endDistance / startDistance;
      return diff;
    },
    // 实际偏移量
    offsetPoint: {
      x: 0,
      y: 0,
    },
    tempOffset: { x: 0, y: 0 },
    limitOffset(x, y) {
      this.tempOffset.x = x;
      this.tempOffset.y = y;
      // if (this.tempOffset.x < 10) {
      //   this.tempOffset.x = 10
      // } else if (this.tempOffset.x > this.box.width - 10) {
      //   this.tempOffset.x = this.box.width - 10
      // } else {
      //   this.tempOffset.x = x
      // }
      // if (this.tempOffset.y < 10) {
      //   this.tempOffset.y = 10
      // } else if (this.tempOffset.y > this.box.height - 10) {
      //   this.tempOffset.y = this.box.height - 10
      // } else {
      //   this.tempOffset.y = y
      // }
    },
    image: { width: 0, height: 0 },
    onload: (e) => {
      const RATIO = document.body.clientWidth / document.body.clientHeight;
      const { width, height } = e.currentTarget || {};
      console.log(width, height);
      local.image.width = width || 0;
      local.image.height = height || 1;
      const ratio = (width || 0) / (height || 1);
      if (width <= document.body.clientWidth) {
        // 无需缩放
        local.base_scale =
          RATIO > ratio
            ? document.body.clientHeight / height
            : document.body.clientWidth / width;
        local.curr_scale = 1;
      } else {
        // 缩小
        if (RATIO > ratio) {
          // 长图
          e.currentTarget.width = (width * document.body.clientHeight) / height;
          e.currentTarget.height = document.body.clientHeight;

          local.base_scale = document.body.clientHeight / height;
        } else {
          // 宽图
          e.currentTarget.width = document.body.clientWidth;
          e.currentTarget.height = (height * document.body.clientWidth) / width;

          local.base_scale = document.body.clientWidth / width;
        }
        local.curr_scale = 1;
        transform();
      }
    },
    dragPoint: { x: 0, y: 0 },
    scaleCenter: { x: 0, y: 0 },

    // 是否是双击
    isDoubleTap: false,
    // 操作方式: zoom 缩放, drag 拖动
    interaction: '',
    // 触摸点数量
    fingers: 0,
    // 是否处于拖动中
    isMove: false,
    // 起始触摸点数据
    startTouches: [],
    // 上次触摸时间
    lastTouchStart: 0,
    // 定时器
    tapTimer: null,
  }));
  const container = useRef(null);
  const element = useRef(null);

  /**
   * 获取触摸点相对坐标
   */
  const getTouches = useCallback((e) => {
    let rect = container.current.getBoundingClientRect();
    let scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    let scrollLeft =
      document.documentElement.scrollLeft || document.body.scrollLeft;
    let posTop = rect.top + scrollTop;
    let posLeft = rect.left + scrollLeft;
    let touches = e.touches.length ? e.touches : e.changedTouches;
    return Array.prototype.slice.call(touches).map((touch) => ({
      x: touch.pageX - posLeft,
      y: touch.pageY - posTop,
    }));
  }, []);
  // 检测双击事件
  const detectDoubleTap = useCallback((e) => {
    let time = Date.now();
    if (local.lastTouchStart === 0) {
      local.lastTouchStart = time;
      return;
    }
    if (time - local.lastTouchStart < 300) {
      e.preventDefault();
      e.stopPropagation();
      local.isDoubleTap = true;
    } else {
      local.isDoubleTap = false;
    }
  });
  // 处理双击事件
  const handleDoubleTap = useCallback((e) => {
    // TODO: 还原scale
    if (typeof onDoubleTap === 'function') {
      onDoubleTap();
    }
  }, []);

  // (缩放/拖动)操作结束
  const end = useCallback(() => {
    local.offsetPoint.x += local.tempOffset.x;
    local.offsetPoint.y += local.tempOffset.y;
    local.tempOffset.x = 0;
    local.tempOffset.y = 0;
    local.curr_scale *= local.incr_scale;
    local.incr_scale = 1;
  }, []);

  // 触摸开始根据触摸点数判断是放大还是拖动并记录坐标
  const onTouchStart = useCallback((e) => {
    local.isMove = false;
    local.isDoubleTap = false;
    local.fingers = e.touches.length;
    local.startTouches = getTouches(e);
    // 每次移动临时偏移量
    local.tempOffset.x = 0;
    local.tempOffset.y = 0;
    local.incr_scale = 1;
    if (local.fingers >= 2) {
      local.interaction = 'zoom';
      let center = getTouchCenter(local.startTouches);
      // 缩放的中心点
      local.scaleCenter.x = center.x;
      local.scaleCenter.y = center.y;
    } else if (local.fingers === 1) {
      local.interaction = 'drag';
      // 起始拖动点
      local.dragPoint.x = local.startTouches[0].x;
      local.dragPoint.y = local.startTouches[0].y;
    } else {
      local.interaction = '';
    }
  }, []);
  const onTouchMove = useCallback((e) => {
    local.isMove = true;
    if (local.interaction) {
      e.preventDefault();
      e.stopPropagation();
    }
    const targetTouches = getTouches(e);
    switch (local.interaction) {
      case 'zoom':
        if (local.fingers >= 2) {
          local.incr_scale = local.calc_incr_scale(
            local.startTouches,
            targetTouches,
          );
          local.tempOffset.x =
            local.scaleCenter.x -
            local.incr_scale * local.scaleCenter.x -
            local.offsetPoint.x +
            local.incr_scale * local.offsetPoint.x;
          local.tempOffset.y =
            local.scaleCenter.y -
            local.incr_scale * local.scaleCenter.y -
            local.offsetPoint.y +
            local.incr_scale * local.offsetPoint.y;
        }
        break;
      case 'drag':
        let touch = getTouches(e)[0];
        if (local.fingers === 1) {
          local.tempOffset.x = touch.x - local.dragPoint.x;
          local.tempOffset.y = touch.y - local.dragPoint.y;
        }
        break;
    }
    transform();
  }, []);
  const onTouchEnd = useCallback((e) => {
    // e.touches 在start时有，在这里就没了
    if (!local.isMove) {
      if (local.fingers === 1) {
        detectDoubleTap(e);
        if (local.tapTimer) {
          clearTimeout(local.tapTimer);
        }
        if (local.isDoubleTap) {
          onDoubleTap(e);
          return;
        }
        local.tapTimer = setTimeout(() => {
          local.lastTouchStart = 0;
          onTap && onTap(e);
        }, 300);
      }
    }
    end(e);
  }, []);
  // 关闭收尾
  const onClose = useCallback(() => {
    local.offsetPoint.x = 0;
    local.offsetPoint.y = 0;
    local.curr_scale = 1;
    transform();
  }, [visible]);

  const onResize = useCallback(() => {
    // local.computeInitialOffset()
    // local.resetOffset()
  });
  // 使用滚轮缩放
  const onWheel = useCallback((e) => {
    local.scaleCenter.x = e.clientX;
    local.scaleCenter.y = e.clientY;
    if (e.deltaY > 0) {
      local.incr_scale += 0.1;
    } else {
      local.incr_scale -= 0.1;
    }
    local.tempOffset.x =
      local.scaleCenter.x -
      local.incr_scale * local.scaleCenter.x -
      local.offsetPoint.x +
      local.incr_scale * local.offsetPoint.x;
    local.tempOffset.y =
      local.scaleCenter.y -
      local.incr_scale * local.scaleCenter.y -
      local.offsetPoint.y +
      local.incr_scale * local.offsetPoint.y;
    transform();
  });
  // 缩放平移
  const transform = useCallback(() => {
    if (element.current) {
      let trueScale = local.curr_scale * local.incr_scale;
      let transfrom = `scale3d(${trueScale}, ${trueScale}, 1) translate3d(${(local.offsetPoint.x + local.tempOffset.x) / trueScale}px, ${(local.offsetPoint.y + local.tempOffset.y) / trueScale}px,0)`;
      element.current.style.setProperty('transform', transfrom);
    }
  });

  useEffect(() => {
    if (container.current) {
      container.current.addEventListener('touchmove', onTouchMove);
      const rect = container.current.getBoundingClientRect();
      local.box.width = rect.width;
      local.box.height = rect.height;
      return () => {
        container.current.removeEventListener('touchmove', onTouchMove);
      };
    }
  }, [onTouchMove]);

  useEffect(() => {
    if (element.current && container.current) {
      window.addEventListener('resize', onResize);
      const node = document.getElementsByTagName('img')[0];
      if (node) {
      }
    }
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return (
    <Observer>
      {() => (
        <div
          style={{
            display: visible ? 'block' : 'none',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            backgroundColor: 'rgba(0,0,0,0.8',
          }}
        >
          <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            ref={container}
            onWheel={onWheel}
            style={{
              touchAction: 'none',
              overflow: 'hidden',
              width: '100%',
              height: '100%',
              color: '#fff',
              ...wrapStyle,
            }}
          >
            <div
              ref={element}
              style={{ transformOrigin: '0 0', width: '100%', height: '100%' }}
            >
              {visible && (
                <img
                  src={src}
                  onLoad={local.onload}
                  style={{
                    position: 'absolute',
                    top: '50vh',
                    left: '50vw',
                    transform: 'translate(-50%,-50%)',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </Observer>
  );
};
