import shttp from 'utils/shttp'

export default {
  login({ query, params, data }) {
    // crypto.createHash('md5').update(params.password).digest('hex').toUpperCase()
    return shttp({
      url: '/v1/auth/user/sign-in',
      method: 'post',
      data: { name: params.account, password: params.password },
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
}