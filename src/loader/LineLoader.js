import services from '../services/index';
import LineModel from '../models/LineModel';
import { createItemsLoader } from 'page-group-loader-model/BaseLoaderModel';
import store from '../store';

export default createItemsLoader(
  LineModel,
  async (params) => {
    return services.getLines(params);
  },
  {
    getHostByType(type) {
      const env = store.app.env;
      let url = '';
      this.items.forEach((item) => {
        if (item.type === type && item.env === env) {
          url = item.url;
        }
      });
      return url;
    },
  },
);
