import React, { Fragment } from 'react';
import { Observer } from 'mobx-react-lite';
import { MIconView } from 'components';
import services from 'services';

export default function ({ item, router }) {
  return (
    <Observer>
      {() => (
        <Fragment>
          <div
            className="dd-common-alignside"
            style={{
              margin: '0 10px',
              padding: '10px  0 5px 0',
              borderBottom: '1px solid #eee',
            }}
          >
            <MIconView
              size="md"
              style={{ color: '#999' }}
              type={item.isFinish ? 'FaRegCheckCircle' : 'FaRegCircle'}
              onClick={(e) => {
                item.finishToggle();
                services
                  .updateTodo({ params: { id: item.id }, data: item })
                  .then((res) => {});
              }}
            />
            <span
              style={{ flex: 1, padding: '5px 10px' }}
              onClick={() => {
                router.pushView(`TodoInfo`, { id: item.id });
              }}
            >
              {item.title}
            </span>
            <MIconView type="FaAngleLeft" onClick={() => {}} />
          </div>
        </Fragment>
      )}
    </Observer>
  );
}
