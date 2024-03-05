import React from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { Button } from 'antd-mobile';
import { VisualBoxView, MIconView } from 'components';

function Node({ self, isChild = false, ...props }) {
  const store = useLocalStore(() => ({
    showMenu: false,
    showChildren: false,
  }));
  return (
    <Observer>
      {() => (
        <div className="full-width" style={{ padding: '5px 0' }}>
          <div
            style={{ position: 'relative', display: 'inline-block' }}
            onContextMenu={(e) => {
              store.showMenu = true;
              e.preventDefault();
            }}
          >
            <span
              style={{
                display: 'flex',
                marginLeft: 5,
                backgroundColor: '#eaeaea',
                border: '1px solid #666',
                padding: 3,
                borderRadius: 5,
                zIndex: store.showMenu ? 100 : 98,
                position: 'relative',
              }}
            >
              {self.title}
              <VisualBoxView visible={self.children.length !== 0}>
                <MIconView
                  type={store.showChildren ? 'FaMinusCircle' : 'FaPlusCircle'}
                  onClick={() => (store.showChildren = !store.showChildren)}
                />
              </VisualBoxView>
            </span>
            <div
              onClick={() => (store.showMenu = false)}
              style={{
                display:
                  store.showMenu && props.mode === 'edit' ? 'block' : 'none',
                position: 'fixed',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 99,
              }}
            ></div>
            <div
              style={{
                zIndex: 100,
                display:
                  store.showMenu && props.mode === 'edit' ? 'flex' : 'none',
                whiteSpace: 'nowrap',
                position: 'absolute',
                top: '100%',
                left: '100%',
                backgroundColor: 'white',
                border: '1px solid #bbb',
                borderRadius: 5,
                padding: 5,
              }}
            >
              <div style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
                  onClick={() => {
                    props.openGroupEdit({
                      parent_id: self.id,
                      tree_id: self.tree_id,
                      view: 'tree-node',
                    });
                  }}
                >
                  添加
                </Button>
                <Button
                  onClick={() => {
                    props.destroyGroup(self);
                  }}
                >
                  删除
                </Button>
              </div>
            </div>
          </div>
          <div
            className="full-height"
            style={{
              display: store.showChildren ? 'block' : 'none',
              position: 'relative',
              margin: '10px 0 10px 10px',
              paddingLeft: 10,
            }}
          >
            <VisualBoxView visible={self.children.length !== 0}>
              <span
                style={{
                  width: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '50%',
                  borderTopLeftRadius: '10%',
                  borderLeft: '1px solid #999',
                  transform: 'translateY(-7px)',
                }}
              ></span>
              <span
                style={{
                  width: '100%',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '50%',
                  borderBottomLeftRadius: '10%',
                  borderLeft: '1px solid #999',
                  transform: 'translateY(7px)',
                }}
              ></span>
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: -5,
                  marginTop: -5,
                  borderColor: '#333',
                  borderStyle: 'solid',
                  borderTopWidth: 1,
                  borderLeftWidth: 1,
                  borderRightWidth: 0,
                  borderBottomWidth: 0,
                  width: 10,
                  height: 10,
                  transform: 'rotate(-45deg)',
                }}
              ></span>
            </VisualBoxView>
            {self.children.map((child) => (
              <Node key={child.id} self={child} isChild={true} {...props} />
            ))}
          </div>
        </div>
      )}
    </Observer>
  );
}

export default function Tree(props) {
  return <Node {...props} />;
}
