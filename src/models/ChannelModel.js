import { types } from 'mobx-state-tree'
import Group from './GroupTreeModel'

const Model = types.model({
  id: types.string,
  group_id: types.string,
  desc: types.string,
  title: types.string,
  order_index: types.number,
  editable: types.optional(types.boolean, false),
  data: types.maybeNull(Group),
})

export default Model