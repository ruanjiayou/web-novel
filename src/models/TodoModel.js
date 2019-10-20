import { types } from 'mobx-state-tree'

const TodoModel = types.model('Todo', {
  id: types.string,
  title: types.string,
  content: types.string,
  priority: types.number,
  isFinish: types.boolean,
  isDelay: types.boolean,
  notify: types.boolean,
  giveup: types.boolean,
  startedAt: types.Date,
  endedAt: types.maybeNull(types.Date),
  deletedAt: types.maybeNull(types.Date),
  type: types.string,
}).views(self => ({
  
})).actions(self => ({
  
}))

export default TodoModel