import { types } from 'mobx-state-tree'

const SongSheetModel = types.model('SongSheet', {
  id: types.string,
  uid: types.optional(types.string, ''),
  title: types.string,
  desc: types.string,
  poster: types.string,
  count: types.number
}).views(self => ({

})).actions(self => ({
  
}))

export default SongSheetModel