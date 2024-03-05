const Mock = require('mockjs');

module.exports = {
  'get /v1/user/my-books': async function getMyBooks() {
    return Mock.mock({
      code: 0,
      'data|10': [
        {
          id: '@guid',
          'uid|+1': '@guid',
          uname: '@cname',
          avatar: '@url',
          title: '@ctitle',
          poster: Mock.Random.image('60x80', '##FF6600'),
          desc: '@cparagraph',
          'tags|3-5': ['@cword'],
          words: '@natural(60, 100)',
          comments: '@natural(60, 100)',
          chapters: '@natural(160, 1100)',
          collections: '@natural(60, 100)',
          isApproved: true,
          'status|1': ['loading', 'finished'],
          createdAt: '@datetime',
        },
      ],
    });
  },
};
