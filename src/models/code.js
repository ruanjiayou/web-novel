import { types } from 'mobx-state-tree';

const Model = types.model({
  id: types.integer,
  uid: types.integer,
  name: types.string,
  account: types.string,
  mark: types.string,
});

export default Model;