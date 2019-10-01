const Mock = require('mockjs');
const crypto = require('crypto');
module.exports = {
  'post /v1/auth/user/sign-in': async function login() {
    const data = req.body;
    const password = crypto.createHash('md5').update('123456').digest('hex').toUpperCase();
    if (data.account === 'test' && data.password === password) {
      return {
        code: 0,
        data: { token: 'test' },
      };
    } else {
      return {
        code: -1,
        message: '账号或密码错误',
      };
    }

  },
  'get /v1/user/articles': async function getArticles() {
    return Mock.mock({
      code: 0,
      'data|10': [{
        title: '@ctitle',
        content: '@cparagraph'
      }]
    });
  },
  'get /v1/user/info': async function getInfo() {
    return Mock.mock({
      code: 0,
      'data': {
        name: '@cname',
        id: '@id',
        avatar: '@url',
      }
    });
  }
};