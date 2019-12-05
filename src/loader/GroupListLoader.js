import services from 'services/index'
import { createItemsLoader } from './BaseLoader'
import GroupTreeModel from 'models/GroupTreeModel'

export default createItemsLoader(GroupTreeModel, async (params) => {
  return services.getGroups(params)
})