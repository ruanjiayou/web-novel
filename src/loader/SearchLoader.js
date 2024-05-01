import services from '../services/index';
import ResourceModel from '../models/ResourceModel';
import { createItemsLoader } from 'page-group-loader-model/BaseLoaderModel';
import store from 'store';

export default createItemsLoader(ResourceModel, async (params) => {
  const list = await services.getSearchList(params);
  const ids = list.items.map((it) => it.id);
  if (store.app.isLogin) {
    const marks = await services.getBatchMarks({ data: ids });
    list.items.forEach((item) => {
      if (marks.data[item.id]) {
        item.marked = true;
      }
    });
  }
  return list;
});
