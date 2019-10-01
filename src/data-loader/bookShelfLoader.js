import { createItemsLoader } from './baseLoader';
import Book from 'models/book';
import services from '../services/index';

export default createItemsLoader(Book, async (params) => {
  return services.getMybooks(params);
});