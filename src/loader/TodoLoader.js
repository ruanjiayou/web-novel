import services from 'services/index'
import { createItemLoader } from 'page-group-loader-model/BaseLoaderModel'
import TodoModel from 'models/TodoModel'

export default createItemLoader(TodoModel, async (params) => {
  return services.getTodo(params)
})