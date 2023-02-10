import React, { useCallback, useEffect, useRef } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'

// 获取中心点坐标
const getTouchCenter = (touches) => {
  return {
    x: touches.map(({ x }) => x).reduce((a, b) => a + b, 0) / touches.length,
    y: touches.map(({ y }) => y).reduce((a, b) => a + b, 0) / touches.length,
  }
}
// 触摸点转为坐标点
const targetTouches = touches => {
  return Array.from(touches).map(touch => {
    return {
      x: touch.pageX,
      y: touch.pageY,
    }
  })
}
// 获取两点间的直线距离
const getDistance = (a, b) => {
  let x = a.x - b.x
  let y = a.y - b.y
  return Math.sqrt(x * x, y * y)
}

// 根据触摸点计算缩放倍数
const calculateScale = (startTouches, endTouches) => {
  const startDistance = getDistance(startTouches[0], startTouches[1])
  const endDistance = getDistance(endTouches[0], endTouches[1])
  return endDistance / startDistance
}

const swing = p => {
  return -Math.cos(p * Math.PI) / 2 + 0.5
}

export default ({ children, wrapStyle, style, onUpdate, onTap, onDoubleTap, onDragStart, onDragEnd, onGestureEnd }) => {
  const local = useLocalStore(() => ({
    // 是否是本轮第一次移动
    firstMove: false,
    // 上次操作缩放系数
    lastScale: 1,
    // 缩放系数
    zoomFactor: 1,
    nthZoom: 0,
    // 拖动偏移量
    offset: { x: 0, y: 0 },
    // 初始偏移量
    initialOffset: { x: 0, y: 0 },
    // 是否处于动画中
    inAnimation: false,
    updatePlaned: false,
    animateIndex: null,
    // 是否是双击
    isDoubleTap: false,
    // 操作方式: zoom 缩放, drag 拖动
    interaction: '',
    // 是否在进行操作
    hasInteraction: false,
    // 触摸点数量
    fingers: 0,
    // 是否处于拖动中
    isMove: false,
    // 是否是多点触动
    isMultitouch: false,
    // 起始触摸点数据
    startTouches: [],
    // 上次触摸时间
    lastTouchStart: 0,
    // 定时器
    tapTimer: null,
    // 计算初始偏移量
    computeInitialOffset() {
      let { width, height } = container.current.getBoundingClientRect()
      const k = getInitialZoomFactor();
      local.initialOffset.x = -Math.abs(element.current.offsetWidth * k - width) / 2
      local.initialOffset.y = -Math.abs(element.current.offsetHeight * k - height) / 2
    },
    // 更新偏移坐标
    resetOffset() {
      this.offset.x = this.initialOffset.x
      this.offset.y = this.initialOffset.y
    },

  }))
  const container = useRef(null)
  const element = useRef(null)
  const lastDragPosition = useRef(null)
  const lastZoomCenter = useRef(null)

  /**
   * 获取触摸点相对坐标
   */
  const getTouches = useCallback(e => {
    let rect = container.current.getBoundingClientRect()
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    let scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
    let posTop = rect.top + scrollTop
    let posLeft = rect.left + scrollLeft
    let touches = e.touches.length ? e.touches : e.changedTouches
    return Array.prototype.slice.call(touches).map(touch => ({
      x: touch.pageX - posLeft,
      y: touch.pageY - posTop
    }))
  }, [])
  const _sanitizeOffset = useCallback(() => {
    const rect = container.current.getBoundingClientRect()
    let elWidth = element.current.offsetWidth * getInitialZoomFactor() * local.zoomFactor
    let elHeight = element.current.offsetHeight * getInitialZoomFactor() * local.zoomFactor
    let maxX = elWidth - rect.width
    let maxY = elHeight - rect.height
    let maxOffsetX = Math.max(maxX, 0)
    let maxOffsetY = Math.max(maxY, 0)
    let minOffsetX = Math.min(maxX, 0)
    let minOffsetY = Math.min(maxY, 0)
    return {
      x: Math.min(Math.max(local.offset.x, minOffsetX), maxOffsetX),
      y: Math.min(Math.max(local.offset.y, minOffsetY), maxOffsetY),
    }
  })
  // 缩放并移动
  const scaleTo = useCallback((scale, center) => {
    scale = scaleZoomFactor(scale)
    local.offset.x += (scale - 1) * (center.x + local.offset.x)
    local.offset.y += (scale - 1) * (center.y + local.offset.y)
  }, [])

  // 2.1运行简单缩放动效
  const zoomOutAnimation = useCallback(() => {
    if (local.zoomFactor === 1) {
      return
    }
    let startZoomFactor = local.zoomFactor
    let _zoomFactor = 1

    let center = {
      x: -1 * local.offset.x - (local.offset.x - local.initialOffset.x) / (1 / local.zoomFactor - 1),
      y: -1 * local.offset.y - (local.offset.y - local.initialOffset.y) / (1 / local.zoomFactor - 1),
    }
    let updateProgress = (progress) => {
      scaleTo(startZoomFactor + progress * (_zoomFactor - startZoomFactor), center)
    }
    animate(300, updateProgress, swing)
  }, [])
  // 2.2基于offset运行缩放动效
  const sanitizeOffsetAnimation = useCallback(() => {
    let targetOffset = _sanitizeOffset()
    let startOffset = {
      x: local.offset.x,
      y: local.offset.y,
    }
    let updateProgress = progress => {
      local.offset.x = startOffset.x + progress * (targetOffset.x - startOffset.x)
      local.offset.x = startOffset.y + progress * (targetOffset.y - startOffset.y)
      update()
    }
    animate(300, updateProgress, swing)
  }, [])
  // 3.动效请求帧
  const animate = useCallback((duration, framefn, timefn, callback) => {
    let startTime = Date.now()
    let renderFrame = () => {
      if (!local.inAnimation) {
        return
      }
      let frameTime = Date.now() - startTime
      let progress = frameTime / duration
      if (frameTime >= duration) {
        framefn(1)
        if (callback) {
          callback()
        }
        update()
        local.inAnimation = false
        update()
      } else {
        if (timefn) {
          progress = timefn(progress)
        }
        framefn(progress)
        update()
        local.animateIndex = requestAnimationFrame(renderFrame)
      }
    }
    local.inAnimation = true
    local.animateIndex = requestAnimationFrame(renderFrame)
  }, [])
  // 1.使用动效
  const sanitize = useCallback(() => {
    if (local.zoomFactor < 1.3) {
      zoomOutAnimation()
    } else {
      let sanitizeOffset = _sanitizeOffset()
      if (sanitizeOffset.x !== local.offset.x || sanitizeOffset.y !== local.offset.y) {
        sanitizeOffsetAnimation()
      }
    }
  }, [])
  // 获取初始缩放系数
  const getInitialZoomFactor = useCallback(() => {
    let { width, height } = container.current.getBoundingClientRect()
    let xZoomFactor = width / element.current.offsetWidth
    let yZoomFactor = height / element.current.offsetHeight
    return Math.min(xZoomFactor, yZoomFactor)
  }, [])
  // 检测双击事件
  const detectDoubleTap = useCallback(e => {
    let time = Date.now()
    if (e.changedTouches.length > 1) {
      local.lastTouchStart = 0
    }
    if (time - local.lastTouchStart < 300) {
      e.preventDefault()
      e.stopPropagation()
      handleDoubleTap(e)
      switch (local.interaction) {
        case 'zoom': end(e); break;
        case 'drag': end(e); break;
      }
    } else {
      local.isDoubleTap = false
    }
    if (e.changedTouches.length === 1) {
      local.lastTouchStart = time
    }
  })
  // 处理双击事件
  const handleDoubleTap = useCallback(e => {
    let center = getTouches(e)[0]
    let _zoomFactor = local.zoomFactor > 1 ? 1 : 2
    let startZoomFactor = local.zoomFactor
    if (local.hasInteraction) {
      return
    }
    let updateProgress = progress => {
      scaleTo(startZoomFactor + progress * (_zoomFactor - startZoomFactor), center)
      animate(300, updateProgress, swing)
      if (typeof onDoubleTap === 'function') {
        onDoubleTap()
      }
    }
  }, [])

  // 累乘缩放系数
  const scaleZoomFactor = useCallback(scale => {
    let originalZoomFactor = local.zoomFactor
    local.zoomFactor *= scale
    local.zoomFactor = Math.min(4, Math.max(local.zoomFactor, 0.5))
    return local.zoomFactor / originalZoomFactor
  }, [])

  // 是否能拖动
  const canDrag = useCallback(() => {
    return local.zoomFactor > 1.01
  }, [])
  // 执行拖动事件
  const doDrag = useCallback((center) => {
    if (lastDragPosition.current) {
      local.offset.x += lastDragPosition.current.x - center.x
      local.offset.y += lastDragPosition.current.y - center.y
    }
  }, [])
  // 缩放开始
  const handleZoomStart = useCallback(e => {
    local.inAnimation = false
    local.lastScale = 1
    local.nthZoom = 0
    local.hasInteraction = true
    lastZoomCenter.current = null
  })
  // 拖动开始
  const handleDragStart = useCallback(e => {
    if (typeof onDragStart === 'function') {
      onDragStart()
    }
    local.inAnimation = false
    lastDragPosition.current = getTouches(e)[0]
    local.hasInteraction = true
    handleDrag(e)
  }, [])
  const handleDrag = useCallback((e) => {
    let touch = getTouches(e)[0]
    doDrag(touch)
    let tempOffset = _sanitizeOffset(local.offset)
    local.offset.x = tempOffset.x
    local.offset.y = tempOffset.y
    lastDragPosition.current = touch
  }, [])
  // (缩放/拖动)操作结束
  const end = useCallback(() => {
    local.hasInteraction = false
    lastDragPosition.current = local.offset
    sanitize()
    update()
  }, [])

  // 动效更新请求帧
  const update = useCallback(() => {
    if (local.updatePlaned) return;
    const updateFrame = () => {
      let scale = getInitialZoomFactor() * local.zoomFactor
      let x = -local.offset.x / scale
      let y = -local.offset.y / scale
      if (onUpdate) {
        onUpdate(scale, getInitialZoomFactor())
      }
      let transfrom = `scale3d(${scale}, ${scale}, 1) translate3d(${x}px, ${y}px,0)`
      element.current.style.setProperty('transform', transfrom)
    }
    local.updatePlaned = true
    local.animateIndex = requestAnimationFrame(() => {
      local.updatePlaned = false;
      updateFrame()
    })
  }, [])
  const onTouchStart = useCallback(e => {
    local.firstMove = true
    local.isMove = false
    local.fingers = e.touches.length
    if (local.fingers > 1) {
      local.isMultitouch = true
    } else if (local.fingers === 1) {
      local.isMultitouch = false
    }
  }, [])
  const onTouchMove = useCallback(e => {
    if (local.firstMove) {
      let newInteraction = ''
      if (local.fingers === 2) {
        newInteraction = 'zoom'
      } else if (local.fingers === 1 && canDrag()) {
        newInteraction = 'drag'
      }
      if (local.interaction !== newInteraction) {
        if (local.interaction && !newInteraction) {
          switch (local.interaction) {
            case 'zoom': end(e); break;
            case 'drag': end(e); break;
          }
        }
        switch (newInteraction) {
          case 'zoom': handleZoomStart(e); break;
          case 'drag': handleDragStart(e);
        }
      }
      local.interaction = newInteraction
      if (local.interaction) {
        e.preventDefault()
        e.stopPropagation()
      }
      local.startTouches = targetTouches(e.touches)
    } else {
      switch (local.interaction) {
        case 'zoom':
          if (local.startTouches.length === 2 && e.touches.length === 2) {
            e.preventDefault()
            // handleZoom
            let newScale = calculateScale(local.startTouches, targetTouches(e.touches))
            let center = getTouchCenter(getTouches(e))
            let scale = newScale / local.lastScale
            local.lastScale = newScale
            scale = scaleZoomFactor(scale)
            local.offset.x += (scale - 1) * (center.x + local.offset.x)
            local.offset.y += (scale - 1) * (center.y + local.offset.y)
            doDrag(center, lastZoomCenter)

            lastZoomCenter.current = center
          }
          break;
        case 'drag':
          e.preventDefault()
          handleDrag(e);
          break;
      }
      if (local.interaction) {
        e.preventDefault()
        e.stopPropagation()
        update()
      }
    }
    local.isMove = true
    local.firstMove = false
  }, [])
  const onTouchEnd = useCallback(e => {
    local.fingers = e.touches.length;
    if (local.isMove) {
      if (!local.isMultitouch) {
        detectDoubleTap(e)
        if (local.tapTimer) {
          clearTimeout(local.tapTimer)
        }
        if (local.isDoubleTap) {
          return
        }
        local.tapTimer = setTimeout(() => {
          if (typeof onGestureEnd === 'function') {
            onGestureEnd()
          }
        }, 300)
      }
    } else {
      console.log('detect tap')
      onTap && onTap();
    }
    end(e)
  }, [])

  useEffect(() => {
    if (container.current) {
      container.current.addEventListener('touchmove', onTouchMove)
      return () => {
        container.current.removeEventListener('touchmove', onTouchMove)
      }
    }
  }, [onTouchMove])

  const onResize = useCallback(() => {
    local.computeInitialOffset()
    local.resetOffset()
    update()
  })
  useEffect(() => {
    if (element.current && container.current) {
      window.addEventListener('resize', onResize)
      update()
      local.computeInitialOffset()
      local.resetOffset()
    }
    return () => {
      local.inAnimation = false;
      cancelAnimationFrame(local.animateIndex)
      window.removeEventListener('resize', onResize)
    }
  }, [])
  return <Observer>{() => (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      ref={container}
      style={{ touchAction: 'none', overflow: 'hidden', width: '100%', height: '100%', color: '#fff', ...wrapStyle }}
    >
      <span style={{ position: 'absolute', left: 10, top: 10, zIndex: 2, color: 'red', backgroundColor: 'rgba(0,0,0,0.4)' }}>
        zoom:{local.zoomFactor} scale:{local.lastScale} center.x:{lastDragPosition.current ? lastDragPosition.current.x : 0} center.y:{lastDragPosition.current ? lastDragPosition.current.y : 0}
      </span>
      <div ref={element} style={{ transformOrigin: '0 0', width: '100%', height: '100%', position: 'relative' }}>
        {children}
      </div>
    </div>
  )}</Observer>
}