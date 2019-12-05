import services from 'services/index'
import SongSheetSongModel from 'models/SongSheetSongModel'
import { createItemsLoader } from './BaseLoader'

export default createItemsLoader(SongSheetSongModel, async (params) => {
  return services.getSongSheet(params)
})