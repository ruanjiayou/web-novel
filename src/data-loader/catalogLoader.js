import { createItemsLoader } from './baseLoader';
import Chapter from 'models/catalog';
import services from '../services/index';

export default createItemsLoader(Chapter, async (params) => {
  console.log(params, 'catalog?');
  return services.getBookCatalog(params);
});