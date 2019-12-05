import React, { Fragment } from 'react'

export default function (props) {
    return <Fragment>
        <div style={props.style}>
            <div style={{ position: 'relative', paddingTop: (props.ratio || 1) * 100 + '%' }}>
                {props.children}
            </div>
        </div>
    </Fragment>
}