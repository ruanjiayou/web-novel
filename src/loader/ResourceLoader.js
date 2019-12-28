import services from 'services'
import ResourceModel from 'models/ResourceModel'
import { createItemLoader } from './BaseLoader'

export default createItemLoader(ResourceModel, async (params) => {
  return services.getResource(params)
})