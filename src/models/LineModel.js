import { types } from 'mobx-state-tree';

const LineModel = types
  .model('Line', {
    id: types.string,
    name: types.string,
    desc: types.string,
    enabled: types.boolean,
    type: types.string,
    host: types.string,
  })
  .views((self) => ({}))
  .actions((self) => ({}));

export default LineModel;
