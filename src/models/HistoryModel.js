import { types } from 'mobx-state-tree';
import store from 'store';
import ResourceModel from './ResourceModel';

const MarkModel = types
  .model('HistoryModel', {
    _id: types.string,
    resource_id: types.string,
    resource_type: types.string,
    media_id: types.string,
    media_type: types.string,
    total: types.number,
    watched: types.number,
    device: types.optional(types.string, ''),
    user_id: types.string,
    created_at: types.optional(types.string, new Date().toLocaleString()),
    detail: ResourceModel,
  })
  .views((self) => ({
    get auto_cover() {
      const poster = self.poster ? self.poster : '/poster/nocover.jpg';
      return store.lineLoader.getHostByType('image') + poster;
    },
  }))
  .actions((self) => ({}));

export default MarkModel;
