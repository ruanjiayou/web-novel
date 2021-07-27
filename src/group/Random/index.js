import React from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { VisualBoxView, MIconView } from 'components'
import ResourceItem from 'business/ResourceItem/index'
import services from '../../services/index'
import { Container } from './style'

export default function Random({ self }) {
  const local = useLocalStore(() => ({
    loading: false
  }))
  return <Observer>{() => (
    <div>
      <div className="dd-common-alignside" style={{ borderLeft: '5px solid #ff9999', padding: '10px 0 10px 10px', margin: '10px 0 0 10px', fontSize: 16 }}>
        <span>{self.title}</span>
        <VisualBoxView visible={self.more.channel_id !== ''}>
          <MIconView style={{ fontSize: 12, color: '#888' }} type="FaAngleRight" before="更多" />
        </VisualBoxView>
      </div>
      <Container onTouchStart={(e) => { e.stopPropagation() }}>
        {self.data.map((d, index) => (<div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}><ResourceItem key={index} item={d} /></div>))}
      </Container>
      <VisualBoxView visible={self.attrs.random === true}>
        <MIconView style={{ textAlign: 'center', padding: 15, fontSize: 13 }} type="FaRedo" after="换一换" onClick={async () => {
          try {
            local.loading = true
            const result = await services.getGroupResources({ params: { group_id: self.id } })
            self.setData(result.items);
          } finally {
            local.loading = false
          }
        }} />
      </VisualBoxView>
    </div>
  )}</Observer>
}