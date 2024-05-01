import shttp from 'utils/shttp';
import { stringfyQuery, sleep } from 'utils/utils';
import store from '../store'

export default {
  async getBoot() {
    const hosts = ['http://ios.nat300.top', 'https://u67631x482.vicp.fun', 'https://jiayou.com', 'https://192.168.0.124'];
    const url = await new Promise((resolve, reject) => {
      let resolved = false, finished = 0;
      if (window.location.hostname === '192.168.0.124') {
        return resolve('https://192.168.0.124/gw/novel')
      }
      hosts.forEach((url) => {
        fetch(url, { method: 'get', mode: 'cors' }).then(resp => {
          finished++;
          if (!resolved) {
            resolved = true;
            return resolve(url + '/gw/novel');
          }
          if (finished === hosts.length) {
            resolve('')
          }
        }).catch(err => {
          finished++;
          if (finished === hosts.length) {
            resolve('');
          }
        })
      })
    })
    if (url) {
      store.app.setBaseURL(url);
      console.log('set race url:', url)
      shttp.defaults.baseURL = url;
    } else if (!store.app.baseURL) {
      throw ('获取线路失败');
    }
    return shttp({
      url: '/v1/public/boot',
    });
  },
  async getResourceList({ query, params, data }) {
    const result = await shttp({
      url: `/v1/public/resources${stringfyQuery(query)}`,
    });
    return { items: result.data, ended: result.data.length < 10 };
  },
  async getSearchList({ query }) {
    const result = await shttp({
      url: `/v1/search/${stringfyQuery(query)}`,
    });
    return { items: result.data, ended: result.data.length < 10 };
  },
  async getRecommendResourceList({ query, params, data }) {
    const result = await shttp({
      url: `/v1/public/recommend${stringfyQuery(query)}`,
    });
    return { items: result.data };
  },
  async getResource({ query, params }) {
    const result = await shttp({
      url: `/v1/public/resource/${params.id}`,
    });
    return { item: result.data };
  },
  async getBookInfo({ query, params, data }) {
    const result = await shttp({
      url: `/v1/public/book/${params.id}`,
    });
    return { item: result.data };
  },
  async getBookCatalog({ query, params, data }) {
    let search = '';
    for (let k in query) {
      search += `&${k}=${query[k]}`;
    }
    const result = await shttp({
      url: `/v1/public/book/${params.id}/catalog?${search}`,
    });
    return { items: result.data, ended: result.data.length < 20 };
  },
  async getBookList({ query, params, data }) {
    const result = await shttp({
      url: `/v1/public/books${stringfyQuery(query)}`,
    });
    return { items: result.data, ended: result.data.length < 10 };
  },
  async getCategoryList() {
    const result = await shttp({
      url: '/v1/public/categories',
    });
    const tree = {};
    result.data.forEach((c) => {
      c.children = [];
      if (c.pid === '') {
        tree[c.tid] = c;
      }
    });
    result.data.forEach((c) => {
      if (c.pid !== '') {
        tree[c.tid].children.push(c);
      }
    });
    const items = [];
    for (let k in tree) {
      items.push(tree[k]);
    }
    return { items, ended: true };
  },
  async getGroupTree({ query, params, data }) {
    const result = await shttp({
      url: `/v1/public/group-tree/${params.name}`,
    });
    if (result.code !== 0) {
      throw result;
    }
    return { item: result.data };
  },
  async getGroupResources({ params }) {
    const resp = await shttp({
      url: `/v1/public/group/${params.group_id}/resources`,
    });
    if (resp.code !== 0) {
      throw resp;
    }
    return { items: resp.data };
  },
  async getChannel({ }) {
    const result = await shttp({
      url: '/v1/public/channels',
    });
    return { items: result.data };
  },
  async getGroups({ query, params, data }) {
    const result = await shttp({
      url: '/v1/public/groups',
    });
    return { items: result.data };
  },
  async getSongSheets({ query, params, data }) {
    const result = await shttp({
      url: '/v1/public/song-sheets',
    });
    return { items: result.data };
  },
  async getSongSheet({ query, params, data }) {
    const result = await shttp({
      url: `/v1/public/song-sheet/${params.id}`,
    });
    result.data.forEach((it, index) => {
      it.order = index;
    });
    return { items: result.data };
  },
  async getSongs({ query, params, data }) {
    const result = await shttp({
      url: `/v1/public/songs${stringfyQuery(query)}`,
    });
    return {
      items: result.data,
      ended: result.data.length < 10 ? true : false,
    };
  },
  async getLines({ query, params, data }) {
    const result = await shttp({
      url: '/v1/public/lines',
    });
    return { items: result.data };
  },
  async getImages({ query, params, data }) {
    const result = await shttp({
      url: `/v1/public/images${stringfyQuery(query)}`,
    });
    return {
      items: result.data,
      ended: result.data.length < 10 ? true : false,
    };
  },
  async getGalleryItems({ params }) {
    const result = await shttp({
      url: `/v1/public/comic/${params.bid}/galleries`,
    });
    return { items: result.data, ended: true };
  },
  async getGalleryDetail({ params }) {
    const result = await shttp({
      url: `/v1/public/comic/${params.bid}/galleries/${params.id}`,
    });
    return { item: result.data };
  },
  async createFeedback(data) {
    const result = await shttp({
      method: 'post',
      url: `/v1/public/feedback`,
      data,
    });
    return { items: result.data };
  },
  async createHistory(data) {
    return shttp({
      url: '/v1/public/history',
      method: 'POST',
      data,
    });
  },
};
