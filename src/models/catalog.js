import { types } from 'mobx-state-tree';

const Model = types.model({
  id: types.string,
  bid: types.string,
  title: types.string,
  isApproved: types.boolean,
  createdAt: types.string,
  words: types.number,
  comments: types.number,
});

export default Model;