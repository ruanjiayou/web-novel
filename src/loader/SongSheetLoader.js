import services from 'services/index'
import { createItemsLoader } from './BaseLoader'
import SongSheetModel from 'models/SongSheetModel'

export default createItemsLoader(SongSheetModel, async (params) => {
  return services.getSongSheets(params)
})