import { types, flow } from 'mobx-state-tree'
import ResourceModel from './ResourceModel'
import services from '../services'

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
    random: types.maybeNull(types.boolean),
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
  get selectedArr() {
    if (self.view === 'filter') {
      const list = [];
      self.children.forEach(row => {
        if (row.children.length) {
          row.children.forEach(tag => {
            if (tag.attrs.selected) {
              list.push(tag.title)
            }
          })
        }
      })
      return list;
    } else {
      return []
    }
    return self.children.filter(child => child.attrs.selected).map(child => child.title)
  },
})).actions(self => ({
  selected(status) {
    if (self.attrs.selected !== status) {
      self.attrs.selected = status
    }
  },
  setData(data) {
    self.data = data || [];
  },
}))

export default GroupModel