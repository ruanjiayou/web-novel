import createView, { AutoComp } from './base'

const BaseViewModel = createView({
  // 默认group结构
})
// 在基础的结构上添加成员，如resourceLoader。与GroupModel类似
export default function createPageModel(props) {
  return BaseViewModel.props(props);
};