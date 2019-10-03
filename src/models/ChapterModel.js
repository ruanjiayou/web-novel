import { types } from 'mobx-state-tree'

const Model = types.model({
  id: types.string,
  bid: types.string,
  title: types.optional(types.string, ''),
  createdAt: types.optional(types.string, ''),
  // 特殊部分
  isApproved: types.optional(types.boolean, true),
  order: types.optional(types.number, 1),
  words: types.optional(types.number, 0),
  comments: types.optional(types.number, 0),
  content: types.optional(types.string, ''),
})

export default Model