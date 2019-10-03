import React, { Fragment, useEffect } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { useRouterContext } from 'contexts/router';
import { useStoreContext } from 'contexts/store';
import 'components/common.css';
import MIconView from 'components/MIconView';

const styles = {
  bigCate: {
    margin: '10px 0',
    padding: '0 20px',
    borderLeftWidth: 2,
    borderLeftStyle: 'solid',
    borderLeftColor: 'transparent',
  },
  choosed: {
    borderLeftColor: 'red',
  },
  subCate: {
    width: '50%',
    float: 'left',
    padding: '10px',
  }
};

function SubCate({ cates, router }) {
  if (cates) {
    return cates.children.map(cate => <div key={cate.id} className="full-width" style={styles.subCate}>
      <img src={cate.poster} alt="" style={{ width: 50, height: 60, backgroundColor: '#bbb' }} />
      <div className="dd-common-centerXY" style={{ flexDirection: 'column', alignItems: 'start', paddingLeft: 10, }}>
        <div>{cate.name}</div>
        <div>{cate.count}</div>
      </div>
    </div>)
  } else {
    return null;
  }
}
export default function () {
  const store = useStoreContext();
  const router = useRouterContext();
  const loader = store.categoryLoader;
  const localStore = useLocalStore(() => ({
    selectIndex: 0,
    count: 0,
  }))
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh();
    }
  });
  return <Observer>{
    () => <Fragment>
      <div className="full-height">
        <div className="dd-common-alignside" style={{ height: 45, padding: '0 15px' }}>
          <MIconView type="FaChevronLeft" onClick={() => { router.back(); }} />
          <div>分类</div>
          <div onClick={() => router.pushView('/root/book/search', null, { hideMenu: true, })}>全部作品</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
          <div style={{ borderRight: '1px solid #ccc' }}>
            {loader.items.map((item, index) => <div
              key={item.id}
              style={{ ...styles.bigCate, ...(index === localStore.selectIndex ? styles.choosed : {}) }}
              onClick={() => localStore.selectIndex = index}
            >
              {item.name}
            </div>)}
          </div>
          <div style={{ flex: 1, }}>
            <div style={{ padding: '0 10px' }}>总共{localStore.count}部</div>
            <SubCate router={router} cates={loader.items[localStore.selectIndex]} />
          </div>
        </div>
      </div>
    </Fragment>
  }</Observer>
}