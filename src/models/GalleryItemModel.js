import { types } from 'mobx-state-tree';

const Model = types.model({
  _id: types.string,
  mid: types.string,
  title: types.optional(types.string, ''),
  publishedAt: types.maybe(types.string),
  images: types.array(types.string),
  next: types.maybeNull(types.late(() => Model)),
});

export default Model;
