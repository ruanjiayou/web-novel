import React, { Fragment, useEffect, useCallback } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { useContext } from 'contexts/routerContext';

import { createItemsLoader } from 'data-loader/baseLoader';
import services from 'services';
import Chapter from 'models/catalog';

import ListLoader from 'components/ListLoad';
import ChapterItem from 'business/ChapterItem'

import 'components/common.css';
import MIcon from 'components/MIcon';

export default function () {
  const router = useContext();
  const loader = (createItemsLoader(Chapter, async (params) => {
    return services.getBookCatalog(params);
  }, { id: 111, query: { sort: 'id-asc' } })).create();
  const localStore = useLocalStore(() => ({
    loading: false,
    sortASC: true,
  }));
  useEffect(() => {
    if (loader.isEmpty) {
      loader.refresh();
    }
  });
  return <Observer>{
    () => {
      return <Fragment>
        <div className="full-height">
          <div className="dd-common-alignside" style={{ height: 45, padding: '0 15px' }}>
            <MIcon type="FaChevronLeft" onClick={() => { router.back(); }} />
            <div className="dd-common-alignside">
              <span style={{ padding: '0 10px' }}>目录</span>
              <span style={{ padding: '0 10px' }}>书签</span>
            </div>
            <div className="dd-common-alignside" onClick={() => {
              localStore.sortASC = !localStore.sortASC;
              loader.toggleSort();
            }}>
              <MIcon type={localStore.sortASC ? 'FaSortNumericDown' : 'FaSortNumericUp'} />
              {localStore.sortASC ? '正序' : '倒序'}
            </div>

          </div>
          <div className="full-height-auto">
            <ListLoader
              loader={loader}
              renderItem={(item, sectionId, index) => {
                return <ChapterItem
                  nth={loader.sort === 'asc' ? parseInt(index) + 1 : loader.items.length - parseInt(index)}
                  item={item}
                  router={router}
                  sectionId={sectionId}
                  toggleLoading={() => localStore.loading = !localStore.loading}
                />;
              }}
            />
          </div>
        </div>
      </Fragment>;
    }
  }</Observer>;
}