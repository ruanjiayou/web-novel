import services from 'services/index'
import { createItemLoader } from './BaseLoader'
import GroupTreeModel from 'models/GroupTreeModel'

export default createItemLoader(GroupTreeModel, async (params) => {
  return services.getGroupTree(params)
})