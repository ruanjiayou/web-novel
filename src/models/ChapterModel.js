import { types } from 'mobx-state-tree';
import config from '../config';

const Model = types.model({
  _id: types.string,
  mid: types.string,
  title: types.optional(types.string, ''),
  createdAt: types.optional(types.string, ''),
  // 特殊部分
  nth: types.optional(types.number, 0),
  more: types.maybeNull(types.model({
    words: types.maybeNull(types.number)
  })),
  type: types.union(
    types.literal(config.constant.CHAPTER_TYPE.chatper),
    types.literal(config.constant.CHAPTER_TYPE.volume),
  ),
  content: types.optional(types.string, ''),
  preId: types.maybe(types.string),
  nextId: types.maybe(types.string),
});

export default Model;
