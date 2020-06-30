import React, { Fragment, useRef } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'

export default function Dragger({ children, cb, ...props }) {
  const dragger = useRef(null)
  const store = useLocalStore(() => ({
    started: false,
    top: 0,
    left: 0,
    offsetLeft: 0,
    offsetTop: 0,
    // mode ...
  }))
  return <Observer>{() => (
    <Fragment>
      <div ref={node => {
        if (node) {
          dragger.current = node
          node.addEventListener('touchstart', e => {
            store.started = TextTrackCue
            e = e.touches[0]
            store.left = e.clientX - node.offsetLeft
            store.top = e.clientY - node.offsetTop
            if (store.left < 0) {
              store.left = 0
            }
            if (store.top < 0) {
              store.top = 0
            }
            store.offsetLeft = 0
            store.offsetTop = 0
          }, { passive: true })
          node.addEventListener('touchmove', e => {
            e.stopPropagation()
            e.preventDefault()
            e = e.touches[0]
            if (store.started) {
              store.offsetLeft = e.clientX - store.left
              store.offsetTop = e.clientY - store.top
            }
            // 控制可拖动范围
            if (cb) {
              cb(store)
            }
          }, { passive: true })
          node.addEventListener('touchend', e => {
            store.started = false
          }, { passive: true })
        }
      }}>
        {children}
      </div>
    </Fragment>
  )}</Observer>
}