import React, { Fragment, useEffect } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useRouterContext, useStoreContext, useNaviContext } from 'contexts'

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
    boxSizing: 'border-box',
  }
}

function SubCate({ cates, router }) {
  if (cates) {
    return cates.children.map(cate => <div key={cate.id} className="full-width" style={styles.subCate}>
      <img src={cate.poster} alt="" style={{ width: 60, height: 70, backgroundColor: '#bbb' }} />
      <div className="dd-common-centerXY" style={{ flexDirection: 'column', alignItems: 'start', paddingLeft: 10, }}>
        <div style={{ fontSize: '1.2em', color: 'black', fontWeight: 'bold', paddingBottom: 5 }}>{cate.title}</div>
        <div>{cate.count}部</div>
      </div>
    </div>)
  } else {
    return null
  }
}
export default function () {
  const Navi = useNaviContext()
  const store = useStoreContext()
  const router = useRouterContext()
  const loader = store.categoryLoader
  const localStore = useLocalStore(() => ({
    selectIndex: 0,
    count: 0,
  }))
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh()
    }
  })
  return <Observer>{() => (
    <Fragment>
      <Navi title="分类" router={router}>
        <div style={{ flex: 1, textAlign: 'right' }} onClick={() => router.pushView('/root/group-tree/book-search-all', null, { hideMenu: true, title: '小说' })}>全部作品</div>
      </Navi>
      <div className="full-height-auto" style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
        <div style={{ borderRight: '1px solid #ccc', minWidth: 80 }}>
          {loader.items.map((item, index) => <div
            key={item.id}
            style={{ ...styles.bigCate, ...(index === localStore.selectIndex ? styles.choosed : {}) }}
            onClick={() => localStore.selectIndex = index}
          >
            {item.title}
          </div>)}
        </div>
        <div style={{ flex: 1, height: '100%', overflow: 'auto' }} className="smooth">
          <div style={{ padding: 20 }}>总共{localStore.count}部</div>
          <SubCate router={router} cates={loader.items[localStore.selectIndex]} />
        </div>
      </div>
    </Fragment>
  )}</Observer>
}