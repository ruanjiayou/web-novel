import services from '../services/index'
import UserModel from '../models/UserModel'
import { createItemLoader } from 'page-group-loader-model/BaseLoaderModel'

export default createItemLoader(UserModel, async (params) => {
  return services.getUserInfo(params)
})