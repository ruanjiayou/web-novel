import { types } from 'mobx-state-tree'
import BookModel from './BookModel'

const GroupModel = types.model('Group', {
  tree_id: types.string,
  group_id: types.string,
  parent_id: types.string,
  name: types.string,
  desc: types.string,
  view: types.string,
  refs: types.array(types.string),
  data: types.optional(types.array(BookModel), []),
  attrs: types.model({
    hide_title: types.boolean,
    allowChange: types.boolean,
    selected: types.maybeNull(types.boolean),
    timeout: types.maybeNull(types.number),
    columns: types.maybeNull(types.number),
    showCount: types.maybeNull(types.number),
  }),
  params: types.frozen(null, {}),
  more: types.model({
    channel_id: types.string,
    keyword: types.string,
    type: types.string,
  }),
  nth: types.number,
  children: types.optional(types.array(types.late(() => GroupModel)), []),
}).views(self => ({
  get id() {
    return self.group_id
  },
})).actions(self => ({
  selected(status) {
    if (self.attrs.selected !== status) {
      self.attrs.selected = status
    }
  },
}))

export default GroupModel