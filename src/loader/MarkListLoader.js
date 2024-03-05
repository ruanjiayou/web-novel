import services from '../services/index';
import MarkModel from '../models/MarkModel';
import { createItemsLoader } from 'page-group-loader-model/BaseLoaderModel';

export default createItemsLoader(MarkModel, async (option) => {
  return services.getMarks(option);
});
