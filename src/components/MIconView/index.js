import React from 'react'
import * as IOicons from 'react-icons/io'
import * as Faicons from 'react-icons/fa'
import * as Mdicons from 'react-icons/md'
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

export default function ({ type, className = '', inline = false, size = 'sm', style = {}, after = '', before = '', ...restProps }) {
  const Icon = type.startsWith('Fa') ? Faicons[type] : (type.startsWith('Md') ? Mdicons[type] : IOicons[type])
  return <div style={{ display: inline ? 'inline-block' : 'flex', fontSize: size === 'md' ? '1.5rem' : (size === 'bg' ? '2rem' : '1.1rem'), alignItems: 'center', justifyContent: 'center', ...style, }} className={`${className}`} {...restProps}>
    {before}<Icon style={{ margin: '0 4px', }} />{after}
  </div>
}