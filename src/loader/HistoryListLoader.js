import services from '../services/index'
import HistoryModel from '../models/HistoryModel'
import { createItemsLoader } from 'page-group-loader-model/BaseLoaderModel'

export default createItemsLoader(HistoryModel, async (data) => {
  return services.getHistoryList(data)
})