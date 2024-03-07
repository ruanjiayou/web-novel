import React, { useCallback } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { VisualBoxView, MIconView } from 'components';
import ResourceItem from 'business/ResourceItem/index';
import services from '../../services/index';
import { Container } from './style';
import event from '../../utils/events';

export default function Random({ self }) {
  const local = useLocalStore(() => ({
    loading: false,
    spin: false,
  }));
  const change = useCallback(async () => {
    let ts = Date.now();
    try {
      local.loading = true;
      local.spin = true;
      setTimeout(() => {
        if (!local.loading) {
          local.spin = false;
        }
      }, 2000);
      const result = await services.getGroupResources({
        params: { group_id: self.id },
      });
      self.setData(result.items);
    } finally {
      local.loading = false;
      if (Date.now() - ts > 2000) {
        local.spin = false;
      }
    }
  });
  return (
    <Observer>
      {() => (
        <div>
          <div
            className="dd-common-alignside"
            style={{
              borderLeft: '5px solid #ff9999',
              padding: '10px 0 10px 10px',
              marginTop: 10,
              fontSize: 16,
            }}
          >
            <span>{self.title}</span>
            <VisualBoxView visible={self.more.channel_id !== ''}>
              <MIconView
                style={{ fontSize: 12, color: '#888' }}
                type="FaAngleRight"
                before="更多"
              />
            </VisualBoxView>
          </div>
          <Container
            onTouchStart={(e) => {
              event.emit('swipeStart');
            }}
          >
            {self.data.map((d, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 8,
                }}
              >
                <ResourceItem key={index} display={3} item={d} />
              </div>
            ))}
          </Container>
          <VisualBoxView visible={self.attrs.random === true}>
            <MIconView
              spin={local.spin}
              style={{ textAlign: 'center', paddingTop: 10, paddingBottom: 20, fontSize: 13 }}
              type="FaRedo"
              after="换一换"
              onClick={change}
            />
          </VisualBoxView>
        </div>
      )}
    </Observer>
  );
}
