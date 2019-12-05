import services from 'services/index'
import BookModel from 'models/BookModel'
import { createItemsLoader } from './BaseLoader'

export default createItemsLoader(BookModel, async (params) => {
  return services.getMybooks(params)
})