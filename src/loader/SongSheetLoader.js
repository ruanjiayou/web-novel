import services from 'services/index'
import { createItemsLoader } from 'page-group-loader-model/BaseLoaderModel'
import SongSheetModel from 'models/SongSheetModel'

export default createItemsLoader(SongSheetModel, async (params) => {
  return services.getSongSheets(params)
})