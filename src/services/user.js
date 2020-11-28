import shttp from 'utils/shttp'
import { stringfyQuery } from 'utils/utils'

export default {
  login({ query, params, data }) {
    // crypto.createHash('md5').update(params.password).digest('hex').toUpperCase()
    return shttp({
      url: '/v1/auth/user/sign-in',
      method: 'post',
      data: { name: data.account, password: data.password },
    })
  },
  register({ query, params, data }) {
    return shttp({
      url: '/v1/auth/user/sign-up',
      method: 'post',
      data: { name: params.account, password: params.password },
    })
  },
  refresh({ query, params, data }) {
    return shttp({
      url: '/v1/auth/user/refresh',
      method: 'post',
      data: params,
    })
  },
  async getUserInfo({ query, params, data }) {
    const result = await shttp({
      url: '/v1/user/self',
      method: 'get',
    })
    return { item: result.data }
  },
  async getMybooks() {
    const result = await shttp({
      url: '/v1/user/my-books',
    })
    return { items: result.data, ended: true }
  },
  async getBookFirstChapter({ query, params, data }) {
    const result = await shttp({
      url: `/v1/user/book/${params.id}/first-chapter`
    })
    return { item: result.data }
  },
  async getBookChapter({ query, params, data }) {
    const result = await shttp({
      url: `/v1/user/book/${params.bid}/chapter/${params.id}`
    })
    return { item: result.data }
  },
  async getTodos({ query, params, data }) {
    const result = await shttp({
      url: `/v1/user/todos${stringfyQuery(query)}`
    })
    result.data.forEach(d => {
      d.startedAt = new Date(d.startedAt)
      d.endedAt = new Date(d.endedAt)
    })
    return { items: result.data }
  },
  async createTodo({ query, params, data }) {
    const result = await shttp({
      url: '/v1/user/todo',
      method: 'POST',
      data
    })
    return { item: result.data }
  },
  async getTodo({ query, params, data }) {
    const result = await shttp({
      url: `/v1/user/todo/${params.id}`,
      method: 'GET',
    })
    return { item: result.data }
  },
  async updateTodo({ query, params, data }) {
    const result = await shttp({
      url: `/v1/user/todo/${params.id}`,
      method: 'PUT',
      data
    })
    return { item: result.data }
  },
  async destroyTodo({ query, params, data }) {
    return shttp({
      url: `/v1/user/todo/${params.id}`,
      method: 'DELETE',
      data
    })
  },
  async addSongToSheet({ query, params, data }) {
    return shttp({
      url: `/v1/user/song-sheet/${params.ssid}/song/${params.id}`,
      method: 'POST',
    })
  },
  async removeSheetSong({ query, params, data }) {
    return shttp({
      url: `/v1/user/song-sheet/${params.ssid}/song/${params.id}`,
      method: 'DELETE',
    })
  },
}