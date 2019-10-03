import React from 'react'
import { Observer } from 'mobx-react-lite'

import './index.css'

export default function (props) {
    const keys = [
        { char: '1', name: '', className: '', },
        { char: '2', name: '', className: 'center', },
        { char: '3', name: '', className: '', },
        { char: '4', name: '', className: '', },
        { char: '5', name: '', className: 'center', },
        { char: '6', name: '', className: '', },
        { char: '7', name: '', className: '', },
        { char: '8', name: '', className: 'center', },
        { char: '9', name: '', className: '', },
        { char: '', name: '清空', className: '', },
        { char: '0', name: '', className: 'center', },
        { char: 'x', name: '删除', className: '', },
    ]
    return <Observer>
        {() => {
            return <div style={{ width: '100%', position: 'relative', paddingTop: '100%', marginBottom: '35%' }}>
                <div className="box" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
                    {
                        keys.map((it, index) => <div key={index} className={['cell', it.className].join(' ')} onClick={()=>props.handler(it.char)}>{it.name || it.char}</div>)
                    }
                </div>
            </div>
        }}
    </Observer>

}