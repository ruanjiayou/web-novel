import services from 'services/index'
import { createItemsLoader } from './BaseLoader'
import SongModel from 'models/ResourceModel'

export default createItemsLoader(SongModel, async (params) => {
  return services.getSongs(params)
})