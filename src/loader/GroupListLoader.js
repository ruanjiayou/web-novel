import services from '../services/index'
import GroupModel from '../models/GroupTreeModel'
import { createItemsLoader } from './BaseLoader'

export default createItemsLoader(GroupModel, async () => {
  return services.getGroups({})
})