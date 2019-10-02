import services from 'services/index';
import Chapter from 'models/ChapterModel';
import { createItemsLoader } from './BaseLoader';

export default createItemsLoader(Chapter, async (params) => {
  return services.getBookCatalog(params);
});