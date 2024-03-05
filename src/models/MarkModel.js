import { types } from 'mobx-state-tree'
import store from 'store'
import ResourceModel from './ResourceModel'

const MarkModel = types.model('MarkModel', {
  id: types.string,
  poster: types.string,
  title: types.string,
  type: types.string,
  createdAt: types.string,
  detail: ResourceModel,
}).views(self => ({
  get auto_cover() {
    const poster = self.poster ? self.poster : '/poster/nocover.jpg'
    return store.lineLoader.getHostByType('image') + poster;
  }
})).actions(self => ({

}))

export default MarkModel