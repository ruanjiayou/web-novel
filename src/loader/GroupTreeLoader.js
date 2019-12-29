import services from 'services/index'
import { createItemLoader } from './BaseLoader'
import GroupTreeModel from 'models/GroupTreeModel'

function collect(group, query) {
  if (!group) {
    return query
  }
  if (group.view === 'filter' && group.params) {
    for (const key in group.params) {
      query[key] = group.params[key]
    }
  }
  group.children.forEach(child => {
    if (child.selected) {
      collect(child, query)
    }
  })
  return query
}
export default createItemLoader(
  GroupTreeModel,
  async (params) => {
    return services.getGroupTree(params)
  },
  {
    getQuery() {
      const query = {}
      return collect(this.item, query)
    }
  })