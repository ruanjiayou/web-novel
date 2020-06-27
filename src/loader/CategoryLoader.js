import services from 'services'
import CategoryModel from 'models/CategoryModel'
import { createItemsLoader } from 'page-group-loader-model/BaseLoaderModel'

export default createItemsLoader(CategoryModel, async (params) => {
  return services.getCategoryList(params)
})