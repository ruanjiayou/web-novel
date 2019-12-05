import React, { Fragment } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import globalStore from 'global-state'
import MIconView from '../MIconView'
import Sudoku from '../SudokuView'

import './index.css'

export default function Locker() {
  const store = useLocalStore(() => ({
    pin: [],
    animate: '',
  }))
  function handler(key) {
    if (key === 'x') {
      store.pin.pop()
    } else if (key === '') {
      store.pin = []
    } else {
      store.pin.push(key)
      if (store.pin.length >= globalStore.app.config.lockerLength) {
        if (store.pin.join('') === globalStore.app.config.lockerPin) {
          store.animate = 'success'
          setTimeout(() => {
            globalStore.app.setLocked(false)
          }, 1000)
        } else {
          store.animate = 'fail'
          setTimeout(() => {
            store.animate = ''
            store.pin = []
          }, 1000)
        }
      }
    }
  }
  return <Observer>
    {() => {
      return <Fragment>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ flex: '0 0 0%', width: '100%', }}>
            <MIconView type="FaLock" style={{ width: '100%', margin: '40px 0 40px 0', color: 'green' }} />
            <p>请输入锁定码</p>
            <div className={store.animate} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '80%', margin: 'auto' }}>
              {
                globalStore.app.config.lockerPin.split('').map((it, index) => {
                  if (index >= store.pin.length) {
                    return <MIconView style={{ margin: '0 8px' }} key={index} type="FaRegCircle" />
                  } else {
                    return <MIconView style={{ margin: '0 8px' }} key={index} type="FaCircle" />
                  }
                })
              }
            </div>
          </div>
          <div style={{ flex: 1, width: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Sudoku handler={handler} />
          </div>
        </div>
      </Fragment>
    }}
  </Observer>
}