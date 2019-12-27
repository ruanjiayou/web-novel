import { types } from 'mobx-state-tree'

const TabModel = types.model('Line', {
  name: types.string,
  icon: types.string,
  path: types.string,
  title: types.string,
  hideMenu: types.optional(types.boolean, false),
}).views(self => ({

})).actions(self => ({

}))

export default TabModel