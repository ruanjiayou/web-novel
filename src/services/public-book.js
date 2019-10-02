import shttp from 'utils/shttp';

export default {
  async getBookInfo(params) {
    const result = await shttp({
      url: `/v1/public/book/${params.id}`
    });
    return { item: result.data };
  },
  async getBookCatalog(params) {
    let search = '';
    for (let k in params.query) {
      search += `&${k}=${params.query[k]}`
    }
    const result = await shttp({
      url: `/v1/public/book/${params.id}/catalog?${search}`
    });
    return { items: result.data, ended: result.data.length < 10 };
  },
  async getBookChapter(params) {
    const result = await shttp({
      url: `/v1/public/book/${params.bid}/chapter/${params.id}`
    });
    return { item: result.data };
  },
}; 