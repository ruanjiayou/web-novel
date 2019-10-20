import shttp from 'utils/shttp'
import { stringfyQuery } from 'utils/utils'

export default {
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
      url: `/v1/public/books${stringfyQuery(params.query)}`,
    })
    console.log(result, '>')
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
      url: `/v1/public/group-tree/${params.group_id}`,
    })
    return { item: result.data }
  },
  async getGroups({ query, params, data }) {
    const result = await shttp({
      url: '/v1/public/groups',
    })
    return { items: result.data }
  },
} 