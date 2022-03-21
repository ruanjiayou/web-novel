import { types } from 'mobx-state-tree'
import store from 'store'
import services from 'services'

const Model = types.model('resource', {
  id: types.string,
  uid: types.maybeNull(types.string),
  uname: types.maybeNull(types.string),
  country: types.optional(types.string, 'China'),
  title: types.string,
  poster: types.optional(types.string, ''),
  thumbnail: types.optional(types.string, ''),
  content: types.optional(types.string, ''),
  desc: types.optional(types.string, ''),
  // url: types.string,
  source_type: types.maybeNull(types.string),
  tags: types.array(types.string),
  images: types.array(types.string),
  status: types.enumeration(['init', 'loading', 'finished', 'fail']),
  types: types.array(types.string),
  createdAt: types.string,
  duration: types.optional(types.number, 0),
  words: types.optional(types.number, 0),
  comments: types.optional(types.number, 0),
  collections: types.optional(types.number, 0),
  chapters: types.optional(types.number, 0),

  // 临时非数据库字段
  last: types.optional(types.model('last', {
    url: types.optional(types.string, ''),
    title: types.optional(types.string, ''),
    createdAt: types.optional(types.string, ''),
  }), {}),
  last_seen_ts: types.optional(types.number, 0),
  last_seen_id: types.optional(types.string, ''),
  last_seen_title: types.optional(types.string, ''),
  last_progress: types.optional(types.number, 0),
  playing: types.optional(types.boolean, false),
  materials: types.array(types.model({
    id: types.string,
    type: types.string,
    path: types.string,
  })),
  // 
  marked: types.optional(types.boolean, false),
  children: types.array(types.model({
    title: types.union(types.undefined, types.string),
    path: types.string,
    nth: types.number,
    id: types.string,
  }))
}).actions(self => ({
  toggleStatus() {
    self.playing = !self.playing
  },
  async setMarked(marked) {
    self.marked = marked;
    const data = { id: self.id };
    if (marked) {
      await services.createMark({ data })
    } else {
      await services.destroyMark({ params: data })
    }
  }
})).views(self => ({
  get auto_cover() {
    const poster = self.poster || self.thumbnail ? self.poster || self.thumbnail : '/images/poster/nocover.jpg'
    return store.lineLoader.getHostByType('image') + poster;
  }
}))

export default Model