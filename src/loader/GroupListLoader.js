import services from '../services/index'
import GroupModel from '../models/GroupTreeModel'
import { createItemsLoader } from '../page-group-loader-model/BaseLoaderModel'

export default createItemsLoader(GroupModel, async () => {
  return services.getGroups({})
})