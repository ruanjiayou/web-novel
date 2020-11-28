import { types } from 'mobx-state-tree'
import ResourceModel from './ResourceModel'

const GroupModel = types.model('Group', {
  tree_id: types.string,
  id: types.string,
  parent_id: types.string,
  title: types.optional(types.string, ''),
  name: types.string,
  desc: types.string,
  view: types.string,
  refs: types.array(types.string),
  data: types.array(ResourceModel),
  attrs: types.model({
    // hide_title: types.maybeNull(types.boolean),
    // allowChange: types.maybeNull(types.boolean),
    selected: types.maybeNull(types.boolean),
    timeout: types.maybeNull(types.number),
    columns: types.maybeNull(types.number),
    // showCount: types.maybeNull(types.number),
  }),
  params: types.frozen(null, {}),
  more: types.model({
    channel_id: types.maybeNull(types.string),
    keyword: types.maybeNull(types.string),
    type: types.maybeNull(types.string),
  }),
  nth: types.number,
  children: types.optional(types.array(types.late(() => GroupModel)), []),
}).views(self => ({
  
})).actions(self => ({
  selected(status) {
    if (self.attrs.selected !== status) {
      self.attrs.selected = status
    }
  },
}))

export default GroupModel