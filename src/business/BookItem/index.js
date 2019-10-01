import React, { Fragment } from 'react';
import { Observer } from 'mobx-react-lite';
import 'components/common.css';
import MIcon from 'components/MIcon';

export default function ({ item, router }) {
  return <Observer>
    {() => {
      return <Fragment>
        <div className="full-width" style={{ margin: 10 }} onClick={() => { router.pushView(`/root/book/${item.id}/info`, null, { hideMenu: true }); }}>
          <div className="full-width-fix" style={{ width: 60, height: 80, backgroundColor: 'green', marginRight: 20 }}>
            <img src={item.poster} alt="" />
          </div>
          <div className="full-width-auto full-height">
            <div className="dd-common-alignside">
              <div style={{ fontSize: '1.2rem' }}>{item.title}</div>
              <MIcon type="FaEllipsisH" />
            </div>

            <div style={{ padding: '4px 0', color: 'rgb(146, 145, 145)' }}>{item.uname}-{'xxxxxx'}</div>
            <div style={{ color: 'rgb(146, 145, 145)' }}>17小时前 · 第八百零六章 翻车了</div>
          </div>
        </div>
      </Fragment>;
    }
    }
  </Observer>;

}