import services from '../services/index'
import ChannelModel from '../models/ChannelModel'
import { createItemsLoader } from 'page-group-loader-model/BaseLoaderModel'

export default createItemsLoader(ChannelModel, async () => {
  return services.getChannel({})
})