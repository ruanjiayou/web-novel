import React from 'react'
import { Observer } from 'mobx-react-lite'

import { Wrap, Container, Cell } from './style'

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
            return <Wrap>
                <Container className="box">
                    {
                        keys.map((it, index) => <Cell key={index} style={it.className === 'center' ? { margin: '0 18px' } : {}} onClick={() => props.handler(it.char)}>{it.name || it.char}</Cell>)
                    }
                </Container>
            </Wrap>
        }}
    </Observer>

}