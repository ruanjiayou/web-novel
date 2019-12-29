import shttp from 'utils/shttp'
import { stringfyQuery, sleep } from 'utils/utils'

export default {
  async getBoot() {
    await sleep(1)
    return shttp({
      url: '/v1/public/boot'
    })
  },
  async getResourceList({ query, params, data }) {
    const result = await shttp({
      url: `/v1/public/resources${stringfyQuery(query)}`,
    })
    return { items: result.data, ended: result.data.length < 10 }
  },
  async getResource({ query, params }) {
    const result = await shttp({
      url: `/v1/public/resource/${params.id}`
    })
    return { item: result.data }
  },
  async getBookInfo({ query, params, data }) {
    const result = await shttp({
      url: `/v1/public/book/${params.id}`
    })
    return { item: result.data }
  },
  async getBookCatalog({ query, params, data }) {
    let search = ''
    for (let k in params.query) {
      search += `&${k}=${params.query[k]}`
    }
    const result = await shttp({
      url: `/v1/public/book/${params.id}/catalog?${search}`
    })
    return { items: result.data, ended: result.data.length < 20 }
  },
  async getBookList({ query, params, data }) {
    const result = await shttp({
      url: `/v1/public/books${stringfyQuery(query)}`,
    })
    return { items: result.data, ended: result.data.length < 10 }
  },
  async getCategoryList() {
    const result = await shttp({
      url: '/v1/public/categories'
    })
    const tree = {}
    result.data.forEach(c => {
      c.children = []
      if (c.pid === '') {
        tree[c.tid] = c
      }
    })
    result.data.forEach(c => {
      if (c.pid !== '') {
        tree[c.tid].children.push(c)
      }
    })
    const items = []
    for (let k in tree) {
      items.push(tree[k])
    }
    return { items, ended: true }
  },
  async getGroupTree({ query, params, data }) {
    const result = await shttp({
      url: `/v1/public/group-tree/${params.name}`,
    })
    return { item: result.data }
  },
  async getGroups({ query, params, data }) {
    const result = await shttp({
      url: '/v1/public/groups',
    })
    return { items: result.data }
  },
  async getSongSheets({ query, params, data }) {
    const result = await shttp({
      url: '/v1/public/song-sheets',
    })
    return { items: result.data }
  },
  async getSongSheet({ query, params, data }) {
    const result = await shttp({
      url: `/v1/public/song-sheet/${params.id}`,
    })
    result.data.forEach((it, index) => {
      it.order = index
    })
    return { items: result.data }
  },
  async getSongs({ query, params, data }) {
    const result = await shttp({
      url: `/v1/public/songs${stringfyQuery(query)}`,
    })
    return { items: result.data, ended: result.data.length < 10 ? true : false }
  },
  async getLines({ query, params, data }) {
    const result = await shttp({
      url: '/v1/public/lines'
    })
    return { items: result.data }
  },
  async getImages({ query, params, data }) {
    const result = await shttp({
      url: `/v1/public/images${stringfyQuery(query)}`,
    })
    return { items: result.data, ended: result.data.length < 10 ? true : false }
  },
} 