import shttp from 'utils/shttp';
import { stringfyQuery } from 'utils/utils';
import { stringify } from 'qs';

export default {
  login({ query, params, data }) {
    // crypto.createHash('md5').update(params.password).digest('hex').toUpperCase()
    return shttp({
      url: '/v1/auth/user/sign-in',
      method: 'post',
      data: { name: data.account, password: data.password },
    });
  },
  register({ query, params, data }) {
    return shttp({
      url: '/v1/auth/user/sign-up',
      method: 'post',
      data: { name: params.account, password: params.password },
    });
  },
  refresh({ query, params, data }) {
    return shttp({
      url: '/v1/auth/user/refresh',
      method: 'post',
      data: params,
    });
  },
  async getUserInfo({ query, params, data }) {
    const result = await shttp({
      url: '/v1/user/self',
      method: 'get',
    });
    return { item: result.data };
  },
  async getMybooks() {
    const result = await shttp({
      url: '/v1/user/my-books',
    });
    return { items: result.data, ended: true };
  },
  async getBookFirstChapter({ query, params, data }) {
    const result = await shttp({
      url: `/v1/user/book/${params._id}/first-chapter`,
    });
    return { item: result.data };
  },
  async getBookChapter({ query, params, data }) {
    const result = await shttp({
      url: `/v1/user/book/${params.mid}/chapter/${params._id}`,
    });
    return { item: result.data };
  },
  async addSongToSheet({ query, params, data }) {
    return shttp({
      url: `/v1/user/song-sheet/${params.ssid}/song/${params._id}`,
      method: 'POST',
    });
  },
  async removeSheetSong({ query, params, data }) {
    return shttp({
      url: `/v1/user/song-sheet/${params.ssid}/song/${params._id}`,
      method: 'DELETE',
    });
  },
  async createMark({ query, params, data }) {
    return shttp({
      url: '/v1/user/mark',
      method: 'POST',
      data: data,
    });
  },
  async destroyMark({ query, params, data }) {
    return shttp({
      url: `/v1/user/mark/${params._id}`,
      method: 'DELETE',
      data: data,
    });
  },
  async getMark({ query, params, data }) {
    return shttp({
      url: `/v1/user/mark/${params._id}`,
      method: 'GET',
      data: data,
    });
  },
  async getMarks({ query, params, data }) {
    const result = await shttp({
      url: `/v1/user/marks?type=${query.type || ''}&page=${query.page}`,
      method: 'GET',
    });
    return { items: result.data, isEnded: result.data.length < 10 };
  },
  async getBatchMarks({ data }) {
    return shttp({
      url: '/v1/user/mark-batch',
      method: 'POST',
      data,
    });
  },
  async createSheet({ query, params, data }) {
    return shttp({
      url: '/v1/user/sheet',
      method: 'POST',
      data,
    });
  },
  async getSheets({ query }) {
    const result = await shttp({
      url: `/v1/user/sheets?type=${query.type}`,
      method: 'GET',
    });
    return { items: result.data, isEnded: result.data.length < 10 };
  },
  async getSheet({ params }) {
    const result = await shttp({
      url: `/v1/user/sheet/${params.id}`,
      method: 'GET',
    });
    return { item: result.data };
  },
  async destroySheet({ query, params, data }) {
    return shttp({
      url: `/v1/user/sheet/${params.id}`,
      method: 'DELETE',
    });
  },
  async addToSheet({ query, params, data }) {
    return shttp({
      url: `/v1/user/sheet/${params.id}/batch`,
      method: 'POST',
      data,
    });
  },
  async removeFromSheet({ query, params, data }) {
    return shttp({
      url: `/v1/user/sheet/${params.id}/batch`,
      method: 'DELETE',
      data,
    });
  },
  async getHistoryList({ query, data }) {
    const resp = await shttp({
      url: `/v1/user/history?${stringify(query)}`,
      method: 'GET',
      data,
    });
    return { items: resp.data, ended: resp.data.length < 20 };
  },
  async destroyHistory({ query, params }) {
    return shttp({
      url: `/v1/user/history/${params.id}`,
      method: 'DELETE',
    });
  },
  async getHistoryDetail({ params }) {
    return shttp({
      url: `/v1/user/history/${params.id}`,
      method: 'GET'
    })
  }
};
