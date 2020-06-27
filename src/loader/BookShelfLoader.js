import services from 'services/index'
import ResourceModel from 'models/ResourceModel'
import { createItemsLoader } from '../page-group-loader-model/BaseLoaderModel'

export default createItemsLoader(ResourceModel, async (params) => {
  return services.getMybooks(params)
})