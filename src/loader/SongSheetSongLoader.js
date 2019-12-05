import services from 'services/index'
import SongSheetSongModel from 'models/SongSheetSongModel'
import { createItemsLoader } from './BaseLoader'

export default createItemsLoader(SongSheetSongModel, async (params) => {
  return services.getSongSheet(params)
}, {
    clone(loader) {
      this.items = []
      loader.items.forEach(item => {
        this.items.push(item.toJSON())
      })
    },
    getUrlById(id) {
      let url = ''
      this.items.forEach(item => {
        if (item.id === id) {
          url = item.url
        }
      })
      return url
    },
  })