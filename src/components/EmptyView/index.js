import React from 'react'
import { ActivityIndicator } from 'antd-mobile'

const style = { textAlign: 'center' }

export default function renderEmpty(loader, renderEmpty, refresh) {
  if (loader.isEmpty) {
    if (loader.isLoading) {
      return <div style={style}><ActivityIndicator text="加载中..." /></div>
    } else if (loader.error) {
      return <div style={style}>出错啦!{loader.error.message}<span onClick={() => refresh ? refresh() : loader.refresh()}>点我重试</span></div>
    } else if (renderEmpty) {
      return typeof renderEmpty === 'function' ? renderEmpty(loader) : renderEmpty
    } else {
      return <div style={style}>没有数据,<span onClick={() => refresh ? refresh() : loader.refresh()}>点我重试</span></div>
    }
  }
}