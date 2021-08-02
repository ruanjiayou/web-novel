import { types } from 'mobx-state-tree'
import Group from './GroupTreeModel'
import store from 'store'

const Model = types.model({
  id: types.string,
  group_id: types.string,
  desc: types.string,
  title: types.string,
  order_index: types.number,
  editable: types.optional(types.boolean, false),
  data: types.maybeNull(Group),
  cover: types.maybe(types.string),
}).views(self => ({
  get lineCover() {
    const cover = self.cover ? self.cover : '/images/poster/nocover.jpg'
    return store.lineLoader.getHostByType('image') + cover;
  }
}))

export default Model