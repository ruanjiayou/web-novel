import { types } from 'mobx-state-tree'
import store from 'global-state'

const Model = types.model('resource', {
  id: types.string,
  uid: types.string,
  uname: types.string,
  country: types.optional(types.string, 'China'),
  title: types.string,
  poster: types.string,
  content: types.optional(types.string, ''),
  desc: types.string,
  url: types.string,
  source_type: types.string,
  tags: types.array(types.string),
  images: types.array(types.string),
  status: types.enumeration(['loading', 'finished']),
  type: types.string,
  createdAt: types.string,
  words: types.number,
  comments: types.number,
  collections: types.number,
  chapters: types.number,
  last: types.model('last', {
    url: types.optional(types.string, ''),
    title: types.optional(types.string, ''),
    createdAt: types.optional(types.string, ''),
  }),
  // 临时非数据库字段
  last_seen_ts: types.optional(types.number, 0),
  last_seen_id: types.optional(types.string, ''),
  last_seen_title: types.optional(types.string, ''),
  last_progress: types.optional(types.number, 0),
  playing: types.optional(types.boolean, false),
}).actions(self => ({
  toggleStatus() {
    self.playing = !self.playing
  }
})).views(self => ({
  get auto_cover() {
    const poster = self.poster ? self.poster : '/poster/nocover.jpg'
    return store.lineLoader.getHostByType('image') + poster;
  }
}))

export default Model