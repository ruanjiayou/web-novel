import { types } from 'mobx-state-tree';

const Model = types.model({
  id: types.string,
  uid: types.string,
  uname: types.string,
  // avatar: types.string,
  title: types.string,
  poster: types.string,
  desc: types.string,
  tags: types.array(types.string),
  status: types.enumeration(['loading','finished']),
  isApproved: types.boolean,
  createdAt: types.string,
  words: types.number,
  comments: types.number,
  collections: types.number,
  chapters: types.number,
});

export default Model;