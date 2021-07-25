import React, { useCallback, useEffect, useRef } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'

// 获取中心点坐标
const getTouchCenter = (touches) => {
  return {
    x: touches.map(({ x }) => x).reduce((a, b) => a + b, 0) / touches.length,
    y: touches.map(({ y }) => y).reduce((a, b) => a + b, 0) / touches.length,
  }
}

// 获取两点间的直线距离
const getDistance = (a, b) => {
  let x = a.x - b.x
  let y = a.y - b.y
  return Math.sqrt(x * x, y * y)
}

// 根据触摸点计算缩放倍数
const calculateScale = (startTouches, endTouches, scale) => {
  const startDistance = getDistance(startTouches[0], startTouches[1])
  const endDistance = getDistance(endTouches[0], endTouches[1])
  const newscale = endDistance / startDistance
  const truescalue = newscale * scale
  return truescalue > 2 ? 2 / scale : (truescalue < 0.5 ? 0.5 / scale : newscale)
}

const swing = p => {
  return -Math.cos(p * Math.PI) / 2 + 0.5
}
// TODO: limit x,y into box
// TODO: deal scale anti human
export default ({ children, wrapStyle, style, onUpdate, onDoubleTap, onDragStart, onDragEnd, onGestureEnd }) => {
  const local = useLocalStore(() => ({
    teststr: '',
    size: { width: 0, height: 0 },
    scale: 1,
    dscale: 1,
    offsetPoint: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    limitOffset(x, y) {
      this.offset.x = x
      this.offset.y = y
      // if (this.offset.x < 10) {
      //   this.offset.x = 10
      // } else if (this.offset.x > this.size.width - 10) {
      //   this.offset.x = this.size.width - 10
      // } else {
      //   this.offset.x = x
      // }
      // if (this.offset.y < 10) {
      //   this.offset.y = 10
      // } else if (this.offset.y > this.size.height - 10) {
      //   this.offset.y = this.size.height - 10
      // } else {
      //   this.offset.y = y
      // }
    },

    dragPoint: { x: 0, y: 0 },
    scaleCenter: { x: 0, y: 0 },

    // 是否处于动画中
    inAnimation: false,
    updatePlaned: false,
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

  }))
  const container = useRef(null)
  const element = useRef(null)

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
  // 检测双击事件
  const detectDoubleTap = useCallback(e => {
    let time = Date.now()
    if (e.changedTouches.length >= 1) {
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
    let updateProgress = progress => {
      animate(300, updateProgress, swing)
      if (typeof onDoubleTap === 'function') {
        onDoubleTap()
      }
    }
  }, [])

  // (缩放/拖动)操作结束
  const end = useCallback(() => {
    local.teststr = `o1(${local.offsetPoint.x},${local.offsetPoint.y}) 
    o2(${local.offsetPoint.x + local.offset.x},${local.offsetPoint.y + local.offset.y}) 
    center(${local.scaleCenter.x},${local.scaleCenter.y}) 
    size:${local.size.width},${local.size.height}
    scale:${local.scale * local.dscale}`
    local.hasInteraction = false
    local.isMove = false
    local.fingers = 0
    local.offsetPoint.x += local.offset.x
    local.offsetPoint.y += local.offset.y
    local.offset.x = 0
    local.offset.y = 0
    local.scale *= local.dscale
    local.dscale = 1
    update()
  }, [])
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
        requestAnimationFrame(renderFrame)
      }
    }
    local.inAnimation = true
    requestAnimationFrame(renderFrame)
  }, [])
  // 动效更新请求帧
  const update = useCallback(() => {
    if (local.updatePlaned || !element.current || !container.current) return;
    const trueScale = local.scale * local.dscale
    const updateFrame = () => {
      if (onUpdate) {
        onUpdate(trueScale)
      }
      let transfrom = `scale3d(${trueScale}, ${trueScale}, 1) translate3d(${local.offsetPoint.x + local.offset.x}px, ${local.offsetPoint.y + local.offset.y}px,0)`
      element.current.style.setProperty('transform', transfrom)
    }
    local.updatePlaned = true
    requestAnimationFrame(() => {
      local.updatePlaned = false;
      updateFrame()
    })
  }, [])
  // 触摸开始根据触摸点数判断是放大还是拖动并记录坐标
  const onTouchStart = useCallback(e => {
    local.isMove = false
    local.fingers = e.touches.length
    local.startTouches = getTouches(e)
    local.offset.x = 0
    local.offset.y = 0
    local.dscale = 1
    if (local.fingers === 2) {
      local.interaction = 'zoom'
      let center = getTouchCenter(local.startTouches)
      local.scaleCenter.x = center.x
      local.scaleCenter.y = center.y
      local.inAnimation = false
      local.hasInteraction = false
    } else if (local.fingers === 1) {
      local.interaction = 'drag'
      local.dragPoint.x = local.startTouches[0].x
      local.dragPoint.y = local.startTouches[0].y
    } else {
      local.interaction = ''
    }
  }, [])
  const onTouchMove = useCallback(e => {
    local.isMove = true
    if (local.interaction) {
      e.preventDefault()
      e.stopPropagation()
    }
    const targetTouches = getTouches(e)
    switch (local.interaction) {
      case 'zoom':
        if (local.fingers === 2) {
          local.dscale = calculateScale(local.startTouches, targetTouches, local.scale)
          let trueScale = local.scale * local.dscale
          local.offset.x = local.scaleCenter.x - local.dscale * local.scaleCenter.x - local.offsetPoint.x + local.dscale * local.offsetPoint.x
          local.offset.y = local.scaleCenter.y - local.dscale * local.scaleCenter.y - local.offsetPoint.y + local.dscale * local.offsetPoint.y
          //local.limitOffset(local.offsetPoint.x - (trueScale - 1) * (local.scaleCenter.x - local.offsetPoint.x), local.offsetPoint.y - (trueScale - 1) * (local.scaleCenter.y - local.offsetPoint.y))
        }
        break;
      case 'drag':
        let touch = getTouches(e)[0]
        if (local.fingers === 1) {
          local.limitOffset(touch.x - local.dragPoint.x, touch.y - local.dragPoint.y)
        }
        break;
    }
    update()
  }, [])
  const onTouchEnd = useCallback(e => {
    local.fingers = e.touches.length;
    if (local.isMove && local.fingers === 1) {
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
    end(e)
  }, [])

  useEffect(() => {
    if (container.current) {
      container.current.addEventListener('touchmove', onTouchMove)
      const rect = container.current.getBoundingClientRect()
      local.size.width = rect.width
      local.size.height = rect.height
      return () => {
        container.current.removeEventListener('touchmove', onTouchMove)
      }
    }
  }, [onTouchMove])

  const onResize = useCallback(() => {
    // local.computeInitialOffset()
    // local.resetOffset()
    update()
  })
  useEffect(() => {
    if (element.current && container.current) {
      window.addEventListener('resize', onResize)
      update()
    }
    return () => {
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
        {local.teststr}
      </span>
      <div ref={element} style={{ transformOrigin: '0 0', width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  )}</Observer>
}