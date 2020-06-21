import React from 'react'
import { useStoreContext } from 'contexts'
import { lineLoader } from 'global-state'

export default function ImgLine({ src, ...attrs }) {
  const store = useStoreContext()
  const host = store.lineLoader.getHostByType('image')
  return <img src={host + src} {...attrs} />
}