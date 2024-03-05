import { types } from 'mobx-state-tree';

const TodoModel = types
  .model('Todo', {
    id: types.string,
    title: types.string,
    content: types.string,
    priority: types.maybeNull(types.number),
    isFinish: types.boolean,
    isDelay: types.boolean,
    notify: types.boolean,
    giveup: types.boolean,
    startedAt: types.string,
    endedAt: types.maybeNull(types.string),
    deletedAt: types.maybeNull(types.string),
    type: types.string,
  })
  .views((self) => ({}))
  .actions((self) => ({
    finishToggle() {
      self.isFinish = !self.isFinish;
    },
  }));

export default TodoModel;
