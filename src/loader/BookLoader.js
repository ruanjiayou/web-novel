import services from 'services'
import BookModel from 'models/BookModel'
import { createItemLoader } from './BaseLoader'

export default createItemLoader(BookModel, async (params) => {
  return services.getBookInfo(params)
})