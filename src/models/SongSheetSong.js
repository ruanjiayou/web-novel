import { types } from 'mobx-state-tree'

const SongSheetModel = types.model('MarkedSong', {
  id: types.string,
  poster: types.string,
  title: types.string,
  url: types.string,
}).views(self => ({

})).actions(self => ({
  
}))

export default SongSheetModel