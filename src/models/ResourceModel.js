import { types } from 'mobx-state-tree'

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
  playing: types.optional(types.boolean, false),
}).actions(self => ({
  toggleStatus() {
    self.playing = !self.playing
  }
}))

export default Model