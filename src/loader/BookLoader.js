import services from 'services'
import BookModel from 'models/BookModel'
import { createItemLoader } from './BaseLoader'
import caches from 'utils/cache'

const bookCache = caches.getCache('book')

export default createItemLoader(BookModel, async (params) => {
  const item = await bookCache.getValue(params.id)
  if (item) {
    return { item }
  }
  const result = await services.getBookInfo(params)
  if (result.item) {
    bookCache.setValue(params.id, result.item)
  }
  return result
})