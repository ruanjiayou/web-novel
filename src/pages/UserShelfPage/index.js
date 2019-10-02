import React, { Fragment, useEffect } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';

import { useRouterContext } from 'contexts/router';
import BookItemView from 'business/BookItemView';
import LoaderListView from 'components/LoaderListView';

import BookModel from 'models/BookModel';
import services from 'services';
import { createItemsLoader } from 'loader/BaseLoader';

export default function () {
  const router = useRouterContext();
  const bookShelfLoader = createItemsLoader(BookModel, async (params) => services.getMybooks(params)).create();
  const localStore = useLocalStore(() => ({
    loading: false,
  }));
  useEffect(() => {
    if (bookShelfLoader.isEmpty) {
      bookShelfLoader.refresh();
    }
  });
  return <Observer>{
    () => {
      return <Fragment>
        <LoaderListView
          loader={bookShelfLoader}
          renderItem={(item, sectionId, index) => {
            return <BookItemView
              item={item}
              router={router}
              sectionId={sectionId}
              toggleLoading={() => localStore.loading = !localStore.loading}
            />;
          }}
        />
      </Fragment>;
    }
  }</Observer>;
}