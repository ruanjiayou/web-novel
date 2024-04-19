import { types } from 'mobx-state-tree';

const LineModel = types
  .model('Line', {
    name: types.string,
    desc: types.string,
    enabled: types.boolean,
    type: types.string,
    env: types.string,
    url: types.string,
  })
  .views((self) => ({}))
  .actions((self) => ({}));

export default LineModel;
