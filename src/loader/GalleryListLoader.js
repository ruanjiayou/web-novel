import services from '../services/index'
import Gallery from '../models/GalleryItemModel'
import { createItemsLoader } from 'page-group-loader-model/BaseLoaderModel'

export default createItemsLoader(Gallery, async (option = {}) => {
  return services.getGalleryItems(option)
})