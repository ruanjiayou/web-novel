import { types } from 'mobx-state-tree';

const Model = types.model({
  id: types.string,
  mid: types.string,
  title: types.optional(types.string, ''),
  createdAt: types.optional(types.string, ''),
  // 特殊部分
  nth: types.optional(types.number, 1),
  more: types.maybeNull(types.model({
    words: types.maybeNull(types.number)
  })),
  content: types.optional(types.string, ''),
  preId: types.maybe(types.string),
  nextId: types.maybe(types.string),
});

export default Model;
