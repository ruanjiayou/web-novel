import services from 'services/index'
import { createItemLoader } from 'page-group-loader-model/BaseLoaderModel'
import SongSheetModel from 'models/SongSheetModel'

export default createItemLoader(SongSheetModel, async (option) => {
  return services.getSheet(option)
})