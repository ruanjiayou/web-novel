const Mock = require('mockjs');

module.exports = {
  'get /v1/book/catalog/[0-9a-zA-Z-]+': async function getBookCatalog(req) {
    return Mock.mock({
      code: 0,
      'data|20': [{
        'id': '@guid',
        'bid': 'xxx',
        'title': '@ctitle',
        'isApproved': true,
        'createdAt': '@datetime',
        'words': '@natural(60, 100)',
        'comments': '@natural(60, 100)',
      }]
    });
  },
};
