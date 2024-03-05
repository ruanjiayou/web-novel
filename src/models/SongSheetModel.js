import { types } from 'mobx-state-tree';
import services from 'services';
import MarkedSong from './SongSheetSong';

const SongSheetModel = types
  .model('SongSheet', {
    id: types.string,
    uid: types.optional(types.string, ''),
    title: types.string,
    desc: types.string,
    poster: types.string,
    count: types.number,
    list: types.array(MarkedSong),
  })
  .views((self) => ({}))
  .actions((self) => ({
    async removeById(id) {
      const index = self.list.findIndex((item) => item.id === id);
      if (index !== -1) {
        self.list.splice(index, 1);
      }
    },
  }));

export default SongSheetModel;
