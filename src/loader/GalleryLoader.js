import services from 'services/index'
import Gallery from 'models/GalleryItemModel'
import { createItemLoader } from 'page-group-loader-model/BaseLoaderModel'

export default createItemLoader(Gallery, async (params) => {
  return services.getGalleryDetail(params);
})