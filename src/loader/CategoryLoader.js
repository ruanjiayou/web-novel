import services from 'services'
import CategoryModel from 'models/CategoryModel'
import { createItemsLoader } from './BaseLoader'

export default createItemsLoader(CategoryModel, async (params) => {
  return services.getCategoryList(params)
})