import React from 'react'
import { Observer } from 'mobx-react-lite'
import VisualBoxView from '../../VisualBoxView'
import MIconView from '../../MIconView'
import BookNormalItemView from 'business/BookItemView/Normal'

export default function Picker({ self }) {
  return <Observer>{() => (
    <div>
      {self.attrs.hide_title === false && <div className="dd-common-alignside" style={{ borderLeft: '5px solid #ff9999', paddingLeft: 10 }}>
        <span>{self.name}</span>
        <VisualBoxView visible={self.more.channel_id !== ''}>
          <span style={{ fontSize: 16, color: '#888' }}>
            <MIconView type="FaAngleRight" before="更多" />
          </span>
        </VisualBoxView>
      </div>}
      <div>
        {self.data.map((d, index) => (<BookNormalItemView key={index} item={d} />))}
      </div>
      <VisualBoxView visible={self.attrs.allowChange === true}>
        <div style={{ textAlign: 'center' }}>
          <MIconView type="FaRedo" after="换一换" />
        </div>
      </VisualBoxView>
    </div>
  )}</Observer>
}