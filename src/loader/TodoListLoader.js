import services from 'services/index'
import { createItemsLoader } from '../page-group-loader-model/BaseLoaderModel'
import TodoModel from 'models/TodoModel'

export default createItemsLoader(TodoModel, async (params) => {
  return services.getTodos(params)
})