import services from 'services/index'
import { createItemLoader } from './BaseLoader'
import GroupTreeModel from 'models/GroupTreeModel'

function collect(group, query) {
  if (!group) {
    return query
  }
  if (group.view === '') {
    group.children.forEach(child => {
      collect(child, query)
    })
  }
  if (group.view === 'filter') {
    query.id.push(group.id)
    group.children.forEach(child => {
      collect(child, query)
    })
  }
  if (group.view === 'filter-row') {
    // query.id.push(group.id)
    group.children.forEach(child => {
      if (child.attrs.selected) {
        query.id.push(child.id)
      }
    })
  }
  return query
}
export default createItemLoader(
  GroupTreeModel,
  async (params) => {
    return services.getGroupTree(params)
  },
  {
    getQuery() {
      const query = { id: [] }
      collect(this.item, query)
      return query
    }
  })