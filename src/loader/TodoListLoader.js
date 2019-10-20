import services from 'services/index'
import { createItemsLoader } from './BaseLoader'
import TodoModel from 'models/TodoModel'

export default createItemsLoader(TodoModel, async (params) => {
  return services.getTodos(params)
})