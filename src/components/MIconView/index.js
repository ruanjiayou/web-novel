import React from 'react'
import * as Icons from 'react-icons/fa'
import './index.css'

// https://react-icons.netlify.com/#/icons/fa

// const types = {
//   home: require('./home.svg'),
//   user: require('./user.svg'),
//   map: require('./map.svg'),
//   fire: require('./fire.svg'),
//   search: require('./search.svg'),
//   setting: require('./setting.svg'),
// };

// export default function ({ type, className = '', size = 'md', ...restProps }) {
//   return (<svg className={`am-icon am-icon-${type.substr(1)} am-icon-${size} ${className}`} {...restProps}>
//     <use xlinkHref={require('./home.svg')} />
//   </svg>)
// }

export default function ({ type, className = '', inline = true, size = 'md', style = {}, after = '', before = '', ...restProps }) {
  const Icon = Icons[type]
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...style, }} className={`${className}`} {...restProps}>
    {before}<Icon style={{ margin: 8 }} />{after}
  </div>
}