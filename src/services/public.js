import shttp from 'utils/shttp'
import { stringfyQuery } from 'utils/utils'

export default {
  async getBookInfo(params) {
    const result = await shttp({
      url: `/v1/public/book/${params.id}`
    })
    return { item: result.data }
  },
  async getBookCatalog(params) {
    let search = ''
    for (let k in params.query) {
      search += `&${k}=${params.query[k]}`
    }
    const result = await shttp({
      url: `/v1/public/book/${params.id}/catalog?${search}`
    })
    return { items: result.data, ended: result.data.length < 10 }
  },
  async getBookList(params) {
    const result = await shttp({
      url: `/v1/public/books${stringfyQuery(params)}`,
    })
    console.log(result, '>')
    return { items: result.data, ended: result.data.length < 10 }
  },
  async getBookChapter(params) {
    const result = await shttp({
      url: `/v1/public/book/${params.bid}/chapter/${params.id}`
    })
    return { item: result.data }
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
    console.log(items)
    return { items, ended: true }
  }
} 