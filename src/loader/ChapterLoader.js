import services from 'services/index'
import Chapter from 'models/ChapterModel'
import { createItemLoader } from './BaseLoader'
// import caches from 'utils/cache'

// const chapterCache = caches.getCache('chapter')
export default createItemLoader(Chapter, async (params) => {
  return services.getBookChapter(params)
  // let item = await chapterCache.getValue(params.id)
  // if (item) {
  //   return { item }
  // } else {
  //   const result = await services.getBookChapter(params)
  //   item = result.item
  //   if (item) {
  //     chapterCache.setValue(params.id, item)
  //   }
  // }
  // return { item }
})