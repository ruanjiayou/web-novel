import React from 'react'
import { useStoreContext } from 'contexts'

export default function ImgLine({ src, ...attrs }) {
  const gStore = useStoreContext()
  const host = gStore.lineLoader.getHostByType('image')
  return <img src={host + src} {...attrs} />
}