import { types } from 'mobx-state-tree';

const Model = types.model({
  id: types.string,
  pid: types.string,
  title: types.string,
  name: types.string,
  sort: types.number,
  poster: types.optional(types.string, ''),
  count: types.optional(types.number, 0),
  children: types.maybe(
    types.late(() => types.array(Model)),
    [],
  ),
});

export default Model;
