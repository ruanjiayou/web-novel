import services from 'services/index'
import ResourceModel from 'models/ResourceModel'
import { createItemsLoader } from './BaseLoader'

export default createItemsLoader(ResourceModel, async (params) => {
  return services.getImages(params)
})