import createView from './base'

const BaseGroupModel = createView({
  id: types.string,
  tree_id: types.string,
  parent_id: types.string,
  // view/name/desc/attrs/title/
  params: types.frozen(null, {}),
  more: types.model({
    channel_id: types.string,
    keyword: types.string,
    type: types.string,
  }),
  nth: types.number,
  children: types.array(types.late(() => BaseGroupModel)),
})

// BaseGroupModel 就是 GroupModel Group 
export default function createGroupModel(props) {
  return BaseGroupModel.props(props);
};