import shttp from 'utils/shttp'
import * as crypto from 'crypto'

export default {
  login(params) {
    return shttp({
      url: '/v1/auth/user/sign-in',
      method: 'post',
      data: { account: params.account, password: crypto.createHash('md5').update(params.password).digest('hex').toUpperCase() },
    })
  },
  refresh(params) {
    return shttp({
      url: '/v1/auth/user/refresh',
      method: 'post',
      data: params,
    })
  },
  async getUserInfo(params) {
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
  async getBookFirstChapter(params) {
    const result = await shttp({
      url: `/v1/user/book/${params.id}/first-chapter`
    })
    return { item: result.data }
  },
  async getBookChapter(params) {
    const result = await shttp({
      url: `/v1/user/book/${params.bid}/chapter/${params.id}`
    })
    return { item: result.data }
  },
}