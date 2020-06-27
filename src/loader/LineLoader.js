import services from '../services/index'
import LineModel from '../models/LineModel'
import { createItemsLoader } from 'page-group-loader-model/BaseLoaderModel'
import Config from 'config'

export default createItemsLoader(LineModel, async (params) => {
  return services.getLines(params)
}, {
    getHostByType(type) {
      let host = ''
      type = Config.isDebug ? 'dev-' + type : type
      this.items.forEach(item => {
        if (item.type === type) {
          host = item.host
        }
      })
      return host
    }
  })