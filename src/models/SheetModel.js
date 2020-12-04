import { types } from 'mobx-state-tree'

const SheetModel = types.model('Sheet', {
  id: types.string,
  uid: types.optional(types.string, ''),
  title: types.string,
  desc: types.string,
  type: types.string,
  poster: types.string,
  count: types.number
}).views(self => ({

})).actions(self => ({
  
}))

export default SheetModel