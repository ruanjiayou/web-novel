import React, { Fragment, useEffect } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { useContext } from 'contexts/routerContext';
import 'components/common.css';
import MIcon from 'components/MIcon';
import VisualBox from 'components/VisualBox';
import services from 'services';
import { ActivityIndicator } from 'antd-mobile';

export default function () {
  const router = useContext();
  const localStore = useLocalStore(() => ({
    loading: false,
    book: null,
    shouldFix: false,
  }));
  useEffect(() => {
    if (!localStore.book) {
      localStore.loading = true;
      services.getBookInfo({ id: '13' }).then(res => {
        localStore.book = res.data;
        localStore.loading = false;
      }).catch(err => {
        localStore.loading = false;
      });
    }
  });
  return <Observer>{
    () => {
      if (!localStore.book) {
        return <ActivityIndicator animating={true} />;
      } else {
        return <Fragment>
          <div className="full-height">
            <div className="dd-common-alignside" style={{ height: 45, padding: '0 15px' }}>
              <MIcon type="FaChevronLeft" onClick={() => { router.back(); }} />
              <div>
                <VisualBox visible={localStore.shouldFix}>
                  <div>我的机器人女友</div>
                  <div>松下中二 · 科幻</div>
                </VisualBox>
              </div>
              <MIcon type="FaEllipsisH" />
            </div>
            <div className="full-height-auto">
              <div style={{ padding: '20px 0 10px 0', textAlign: 'center', backgroundColor: '#666', color: 'white' }}>
                <img src={localStore.book.poster} alt="" width={100} height={120} />
                <div style={{ fontSize: 20, padding: 5 }}>{localStore.book.title}</div>
                <div>{localStore.book.uname} · 科幻</div>
              </div>
              <div style={{ padding: '0 20px', borderBottom: '1px solid #ccc', backgroundColor: 'snow' }}>
                <div className="dd-common-alignside" style={{ height: 50, borderBottom: '1px solid #ccc' }}>
                  <div className="dd-common-centerXY" style={{ flex: 1 }}>
                    {localStore.book.words}万字
                  </div>
                  <div className="dd-common-centerXY" style={{ flex: 1 }}>
                    {localStore.book.chapters}章
                  </div>
                  <div className="dd-common-centerXY" style={{ flex: 1 }}>
                    {localStore.book.comments}评论
                  </div>
                </div>
                <div style={{ padding: '10px 0', borderBottom: '1px solid #ccc' }}>
                  {localStore.book.desc}
                </div>
                <div className="full-width" style={{ height: 40 }}>
                  <span className="full-width-auto" style={{ fontWeight: 'bolder' }} onClick={() => { router.pushView(`/root/book/${localStore.book.id}/catalog`, null, { hideMenu: true }); }}>目录</span>
                  <span className="full-width-fix">连载至 729章 · 两小时前更新</span>
                  <MIcon style={{ marginLeft: 10 }} className="full-width-fix" type="FaAngleRight" />
                </div>
              </div>
              <p>TODO:作者 名称 头像 几部作品</p>
            </div>
            <div className="dd-common-alignside" style={{ height: 50 }}>
              <div className="dd-common-centerXY" style={{ flex: 1, backgroundColor: 'rgb(226, 223, 223)', color: 'gray' }}>+ 加入书架</div>
              <div className="dd-common-centerXY" style={{ flex: 1, backgroundColor: 'red', color: 'white' }}>立即阅读</div>
            </div>
          </div>
        </Fragment>;
      }
    }
  }</Observer>;
}