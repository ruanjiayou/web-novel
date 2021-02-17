import { types } from 'mobx-state-tree'
import store from 'store'

const Model = types.model('resource', {
  id: types.string,
  uid: types.maybeNull(types.string),
  uname: types.maybeNull(types.string),
  country: types.optional(types.string, 'China'),
  title: types.string,
  poster: types.string,
  content: types.optional(types.string, ''),
  desc: types.string,
  url: types.string,
  source_type: types.maybeNull(types.string),
  tags: types.array(types.string),
  images: types.array(types.string),
  status: types.enumeration(['loading', 'finished']),
  type: types.maybeNull(types.string),
  createdAt: types.string,
  words: types.maybeNull(types.number),
  comments: types.number,
  collections: types.number,
  chapters: types.maybeNull(types.number),
  last: types.maybeNull(types.model('last', {
    url: types.optional(types.string, ''),
    title: types.optional(types.string, ''),
    createdAt: types.optional(types.string, ''),
  })),
  // 临时非数据库字段
  last_seen_ts: types.optional(types.number, 0),
  last_seen_id: types.optional(types.string, ''),
  last_seen_title: types.optional(types.string, ''),
  last_progress: types.optional(types.number, 0),
  playing: types.optional(types.boolean, false),
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
  }
})).views(self => ({
  get auto_cover() {
    const poster = self.poster ? self.poster : '/images/poster/nocover.jpg'
    return store.lineLoader.getHostByType('image') + poster;
  }
}))

export default Model