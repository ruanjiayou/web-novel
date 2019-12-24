import services from 'services'
import BookModel from 'models/BookModel'
import { createItemLoader } from './BaseLoader'

export default createItemLoader(BookModel, async (params) => {
  const result = await services.getBookInfo(params)
  return result
})