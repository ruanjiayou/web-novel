import React, { Fragment, useEffect } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite';
import BookItem from 'business/BookItem';
import ListLoader from 'components/ListLoad';
import globalStore from 'global-state';
import { useContext } from 'contexts/routerContext';

export default function () {
  const router = useContext();
  const { bookShelfLoader } = globalStore;
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
        <ListLoader
          loader={bookShelfLoader}
          renderItem={(item, sectionId, index) => {
            return <BookItem
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