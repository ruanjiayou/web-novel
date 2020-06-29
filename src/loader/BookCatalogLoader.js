import services from 'services/index'
import Chapter from 'models/ChapterModel'
import { createItemsLoader } from 'page-group-loader-model/BaseLoaderModel'

export default createItemsLoader(Chapter, async (params) => {
  return services.getBookCatalog(params)
})