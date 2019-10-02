const Mock = require('mockjs');

module.exports = {
  'get /v1/public/book/:id([0-9a-zA-Z-]+)/catalog': async function getBookCatalog(req) {
    return Mock.mock({
      code: 0,
      'data|20': [{
        'id': '@guid',
        'bid': 'xxx',
        'title': '@ctitle',
        'isApproved': true,
        'createdAt': '@datetime',
        'words': '@natural(60, 100)',
        'order|+1': 1,
        'comments': '@natural(60, 100)',
        'content': '',
      }]
    });
  },
  'get /v1/public/book/:bid([0-9a-zA-Z-]+)/chapter/:id([0-9a-zA-Z-]+)': async function getBookChapter(req) {
    const params = req.params;
    return Mock.mock({
      code: 0,
      data: {
        id: params.id,
        bid: params.bid,
        title: '@ctitle',
        isApproved: true,
        createdAt: '@datetime',
        words: '@natural(60, 100)',
        comments: '@natural(60, 100)',
        order: 2,
        content: '@cparagraph(100,150)'
      }
    })
  },
};
