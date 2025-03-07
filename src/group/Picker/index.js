import React from 'react';
import { Observer } from 'mobx-react-lite';
import { VisualBoxView, MIconView } from 'components';
import ResourceItem from 'business/ResourceItem';

export default function Picker({ self }) {
  return (
    <Observer>
      {() => (
        <div>
          <div
            className="dd-common-alignside"
            style={{
              borderLeft: '5px solid #ff9999',
              padding: '10px 0 10px 10px',
              margin: '10px 0 10px 10px',
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
          <div
            onScroll={(e) => {
              e.nativeEvent.stopImmediatePropagation();
            }}
          >
            {self.data.map((d, index) => (
              <div key={d._id} style={{ margin: 10 }}>
                <ResourceItem item={d} />
              </div>
            ))}
          </div>
          <VisualBoxView visible={self.attrs.allowChange === true}>
            <MIconView
              style={{ textAlign: 'center', paddingBottom: 8, fontSize: 13 }}
              type="FaRedo"
              after="换一换"
            />
          </VisualBoxView>
        </div>
      )}
    </Observer>
  );
}
