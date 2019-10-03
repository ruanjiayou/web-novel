import { types } from 'mobx-state-tree'

const Model = types.model({
  avatar: types.optional(types.string, ''),
  name: types.optional(types.string, ''),
  id: types.optional(types.string, ''),
})

export default Model