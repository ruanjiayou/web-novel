import shttp from '../utils/shttp';
import * as crypto from 'crypto';

export default {
  login(params) {
    return shttp({
      url: '/v1/auth/user/sign-in',
      method: 'post',
      data: { account: params.account, password: crypto.createHash('md5').update(params.password).digest('hex').toUpperCase() },
    });
  },
  async getUserInfo(params) {
    const result = await shttp({
      url: '/v1/user/info',
      method: 'get',
    });
    return { item: result.data };
  },
  refresh(params) {
    return shttp({
      url: '/v1/auth/user/refresh',
      method: 'post',
      data: params,
    });
  },
  async getArticles(params) {
    const result = await shttp({
      url: '/v1/user/articles',
      method: 'get',
      params: { page: params.page }
    });
    return { items: result.data, ended: false };
  },
  async createCode(params) {
    return shttp({
      url: '/v1/user/code',
      method: 'post',
      data: params,
    });
  },
  async destroyCode(params) {
    return shttp({
      url: `/v1/user/code/${params.id}`,
      method: 'delete',
    });
  },
  async updateCode(params) {
    return shttp({
      url: `/v1/user/code/${params.id}`,
      method: 'put',
      data: params,
    });
  },
  async getCodes(params) {
    const result = await shttp({
      url: '/v1/user/codes',
      method: 'get',
      params: { page: params.page }
    });
    return { items: result.data, ended: true };
  },
  async getCodeVersions(params) {
    return shttp({
      url: `/v1/user/code/${params.id}/versions`,
      method: 'get'
    });
  },
  async createCodeVersion(params) {
    return shttp({
      url: `/v1/user/code/${params.cid}/version`,
      method: 'post',
      data: params
    });
  },
  async getMybooks() {
    const result = await shttp({
      url: '/v1/user/book-shelf',
    });
    return { items: result.data, ended: true };
  },
  getBookInfo(params) {
    return shttp({
      url: `/v1/book/info/${params.id}`
    });
  },
  async getBookCatalog(params) {
    let search = '';
    for (let k in params.query) {
      search += `&${k}=${params.query[k]}`
    }
    const result = await shttp({
      url: `/v1/book/catalog/${params.id}?${search}`
    });
    return { items: result.data, ended: result.data.length < 10 };
  },
}; 