import services from 'services/index'
import { createItemsLoader } from 'page-group-loader-model/BaseLoaderModel'
import SheetModel from 'models/SheetModel'

export default createItemsLoader(SheetModel, async (option) => {
  return services.getSheets(option)
})