import React, { useContext, useState } from 'react';
// useState 可以监控变化 不然可以不用.就router的上下文用到
// 1.创建上下文对象
// const Context = React.createContext(null)
// 2.上下文提供值
// <Context.Provider value={<div></div>}/>
// 3.获取context中的值
// const Comp = useContext(context)

/**
 * 创建 provider
import React, { useContext, useState } from 'react'
import MIconView from 'components/MIconView'

const Context = React.createContext(null)
function Player() {
  return <div></div>
}
export createProvider() {
  return [Player, Context] 
}
export getContextValue() {
  return useContext(Context)
}
*/

/**
 * 创建context
import { createProvider } from '../contexts/xxx'
const [Comp, Context] = createProvider()
<Context.Provider value={Comp}>
  ...
</Context.Provider>
 */

/**
  * 使用上下文的值
import { getContextValue } from '../contexts/xxx'
const Comp = useContext(context)
  */
