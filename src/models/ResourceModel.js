import { types } from 'mobx-state-tree'

const Model = types.model('resource', {
  id: types.string,
  uid: types.string,
  uname: types.string,
  title: types.string,
  poster: types.string,
  desc: types.string,
  url: types.string,
  tags: types.array(types.string),
  status: types.enumeration(['loading', 'finished']),
  createdAt: types.string,
  words: types.number,
  comments: types.number,
  collections: types.number,
  chapters: types.number,
  playing: types.optional(types.boolean, false),
}).actions(self=>({
  toggleStatus() {
    self.playing = !self.playing
  }
}))

export default Model